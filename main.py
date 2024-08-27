from fastapi import FastAPI, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse


from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

app = FastAPI(
    root_path='/admin_panel/'
) 
app.mount('/static', StaticFiles(directory='static'), name = 'static')
templates = Jinja2Templates(directory='templates')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return RedirectResponse(url='/')

@app.get('/')
def admin_panel(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})

@app.get('/client_base')
def client_base(request: Request):
    return templates.TemplateResponse('client_base.html', {'request': request})