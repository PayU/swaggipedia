const API_ENDPOINT = `@@@PUBLIC_API@@@/v1/swaggers`;


export default class SwaggersApi {
  // Get
  static async fetchSwaggers() {
    const fetchedSwaggers = [];

    (await (await fetch(API_ENDPOINT)).json())
      .sort((a, b) => a.name < b.name ? -1 : 1)
      .forEach(swagger => {
        fetchedSwaggers[swagger.name] = swagger;
      })

    return fetchedSwaggers
  }

  static async fetchSwaggerContent(swaggerId) {
    return (await (await fetch(`${API_ENDPOINT}/${swaggerId}`)).json())
  }
}