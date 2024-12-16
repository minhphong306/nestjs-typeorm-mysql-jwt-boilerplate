module.exports = {
    apps: [{
      name: "nestjs-app",
      script: "dist/main.js",
      env: {
        NODE_ENV: "production",
        // Thêm các biến môi trường khác nếu cần
      }
    }]
  }