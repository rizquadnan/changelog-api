import { TEnvConfig } from "./type"

const config: Partial<TEnvConfig> = {
  port: 3001,
  secrets: {
    dbUrl:
      "postgresql://postgres:lol@localhost:5432/api_design_v4?schema=public",
    jwt: "cookies"
  },
};
export default config; 