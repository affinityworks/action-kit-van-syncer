import development from "../config"

(async () => {
  try {
    console.log("dev", development)
    console.log("running...")
  } catch (e) {
    console.error(e)
  }
})()
