from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from api.endpoints.appointments import check_appointments
from api.endpoints.users import deactivate_expired_users
from database import init_db
from api.api_router import api_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware # to enable CORS
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from starlette.middleware.base import BaseHTTPMiddleware
from apscheduler.triggers.cron import CronTrigger
from core.config import settings


# periodic check for valid users and appointments
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(
        deactivate_expired_users,     # remove users with expired status and set appointments to cancelled
        CronTrigger(hour = 0, minute = 0), #every day at Midnight
        id="deactivate_expired_users",
        replace_existing=True
    )
    scheduler.add_job(
        check_appointments,
        'interval', minutes= 30,  #check appointments' status each 30 mins
        id="check_appointments",
        replace_existing=True)
    scheduler.start()
    try:
        yield
    finally:
        scheduler.shutdown()

is_production_mode = settings.env == "production"

# Initialize FastAPI app and lifespan
app = FastAPI(lifespan=lifespan,
                docs_url=None if is_production_mode else "/docs", #block access to "/docs" in production mode
                redoc_url=None if is_production_mode else "/redoc", #block access to "/redoc" in production mode
                openapi_url=None if is_production_mode else "/openapi.json" #block access to "/openapi.json" in production mode
            )

class secureHeader(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        if request.url.path == "/docs":  # to allow only FASTAPI UI
            return response
        response.headers["X-Frame-Options"] = "SAMEORIGIN" # Missing Anti-clickjacking Header
        response.headers["Content-Security-Policy"] = "default-src 'self';" "script-src 'self';" "font-src 'self'; " "connect-src 'self';" "frame-ancestors 'none';" "form-action 'self';" #  Content Security Policy (CSP) Header Not Set
        response.headers["Cross-Origin-Resource-Policy"] = "same-origin" # 	Insufficient Site Isolation Against Spectre Vulnerability
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp" # 	Insufficient Site Isolation Against Spectre Vulnerability
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin" # 	Insufficient Site Isolation Against Spectre Vulnerability
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=(), fullscreen=(self)" # Permissions Policy Header Not Set
        response.headers["X-Content-Type-Options"] = "nosniff" # X-Content-Type-Options Header Missing
        del response.headers["X-Powered-By"] # Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)
        
        # disable caching
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, private"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response


app.add_middleware(secureHeader)
 




scheduler = AsyncIOScheduler()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:4200"],   # allow only requests from the frontend      
    allow_credentials=True,       # Allow cookies or credentials if needed
    allow_methods=["GET","POST","PUT"],          # Allow only 3 methods in HTTP requests
    allow_headers=["*"],          # Allow all headers
)


# initialize database
init_db()

# Include API routes
app.include_router(api_router)





# # run the server with https
if __name__ == "__main__":
    uvicorn.run(
    app,
    host="0.0.0.0",
    port = 8432,
    ssl_keyfile="../../Certificate/key.pem", 
    ssl_certfile="../../Certificate/cert.pem",
    lifespan="on",
)
    
