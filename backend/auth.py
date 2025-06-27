from fastapi import APIRouter,HTTPException,status,Response,Request
import database,utils
from datetime import datetime,timedelta
from starlette.middleware.base import BaseHTTPMiddleware

class AuthMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request, call_next):
    if request.url.path in ["/signin","/signup","/docs"]:
      return await call_next(request) # call /signin etc
    cookies = request.cookies
    print(cookies)
    token = cookies.get('session_token')
    print(token)
    conn = database.get_db()
    cursor = conn.cursor()
    try:
      query = f"select email from user_sessions where session_token = '{token}'"
      print(query)
      cursor.execute(query)
      user_email = cursor.fetchone() 
      if user_email:
        return await call_next(request)
      else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,'unauthorized')  
    except:
      raise HTTPException(status.HTTP_401_UNAUTHORIZED,'unauthorized')
    
router = APIRouter(tags=["auth"])

@router.post('/signup')
def sign_up(user_data: dict):
  print(user_data)
  conn = database.get_db()
  cursor = conn.cursor()
  try:
    username = user_data['username']
    email = user_data['email']
    password = user_data['password']
    encoded_password = utils.encode(password)
    query = f"select * from auth where email = '{email}'"
    print(query)
    cursor.execute(query)
    user_record_from_db = cursor.fetchone() 
    if user_record_from_db: # user record is found, report error
      raise Exception(f"user with {email} already exists, please sign in")
    else: # user record is not found, proceed with sign up
      query = f"insert into auth(user,email,password) values ('{username}','{email}','{encoded_password}')"
      cursor.execute(query)
      conn.commit()
      return {"status": "ok", "data": 'user signed up successfully'}
  except Exception as e:
    raise HTTPException(status.HTTP_400_BAD_REQUEST
                       ,str(e))
  finally:
    cursor.close()
    conn.close()  

@router.post('/signin')
def sign_in(response : Response,user_data: dict):
  print(user_data)
  conn = database.get_db()
  cursor = conn.cursor()
  try:
    email = user_data['email']
    password = user_data['password']
    query = f"select * from auth where email = '{email}'"
    print(query)
    cursor.execute(query)
    user_record_from_db = cursor.fetchone() 
    if not user_record_from_db: # user record is not found, report error
      raise Exception(f"user with {email} doesnt exists, please signup first")
    else: # user record is found, proceed with sign in
      print(user_record_from_db)
      if not utils.verify_passwords(password, user_record_from_db[2]): # user entered wrong password
        raise Exception(f"incorrect username or password. Please try again")
      else: # user record found and passwords match
        query = "insert into user_sessions(email,session_token,created_at,expiry) values (%s,%s,%s,%s)"
        print(query)
        session_token = utils.generate_session_token()
        created_at = datetime.now()
        expiry = datetime.now() + timedelta(minutes = 3)
        print(email,session_token,created_at,expiry)
        cursor.execute(query,[email,session_token,created_at,expiry])
        conn.commit()
        response.set_cookie( key = 'session_token'
                           , value = session_token
                           , httponly= True)
        return {"status": "ok", "data": 'user logged in successfully'}

  except Exception as e:
    raise HTTPException(status.HTTP_400_BAD_REQUEST
                       ,str(e))
  finally:
    cursor.close()
    conn.close()  
  
@router.get('/signout')
def sign_out(request: Request, response : Response): 
  cookies = request.cookies
  print(cookies)
  token = cookies.get('session_token')
  response.delete_cookie( key = 'session_token'
                        , httponly=True)
  conn = database.get_db()
  cursor = conn.cursor()
  try:
    query = f"update user_sessions set expiry = created_at where session_token = '{token}'"
    print(query)
    cursor.execute(query)
    conn.commit()
    return {"status": "ok", "data": 'user signed out successfully'}
  except Exception as e:
    raise HTTPException(status.HTTP_400_BAD_REQUEST
                       ,str(e))
  finally:
    cursor.close()
    conn.close()  