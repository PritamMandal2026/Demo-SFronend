module.exports = {
  apps: [
    {
      name: "servicestation-frontend",
      script: ".next/standalone/server.js",
      cwd: "/home/ubuntu/servicestation-Frontend",
      env: {
        NODE_ENV: "production",
        NEXTAUTH_URL: "https://dev.servicestation.ai",
        NEXTAUTH_SECRET: "super-secret-key",
        AUTH_TRUST_HOST: "true"
      }
    }
  ]
};
