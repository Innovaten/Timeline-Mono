/** @type {import('tailwindcss').Config} */
module.exports = {
  ...(require("@repo/ui/tailwindcss.config.js")),
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    ],
}

