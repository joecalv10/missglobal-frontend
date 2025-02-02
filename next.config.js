/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


const withPWA = require("next-pwa");

const nextConfig = {
    ...withPWA({
        dest: "public",
        register: true,
        skipWaiting: true,
    })
}

module.exports = nextConfig