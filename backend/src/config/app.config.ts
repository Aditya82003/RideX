import { getEnv } from "../utilities/getEnv"

const appConfig =()=>({
    MODE_ENV : getEnv('MODE_ENV','DEVELOPMENT'),
    PORT : getEnv('PORT','5000'),
    DATABASE_URL : getEnv('DATABASE_URL')
})

export const config = appConfig()