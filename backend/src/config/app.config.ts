import { getEnv } from "../utilities/getEnv"

const appConfig =()=>({
    MODE_ENV : getEnv('MODE_ENV','DEVELOPMENT'),
    PORT : getEnv('PORT','5000'),
    BASE_PATH: getEnv('BASE_PATH','/api'),
    FRONTEND_ORIGIN : getEnv('FRONTEND_ORIGIN'),
    DATABASE_URL : getEnv('DATABASE_URL'),
    JWT_SECRET : getEnv('JWT_SECRET'),
    GOOGLE_MAP_API : getEnv('GOOGLE_MAP_API')
})

export const config = appConfig()