const baseUrl = process.env.REACT_APP_SWAGGIPEDIA_API || '';

export default class SwaggersApi {
  // Get
  static async fetchSwaggers() {
    const fetchedSwaggers = [];

    (await (await fetch(`${baseUrl}/v1/swaggers`)).json())
      .sort((a, b) => a.name < b.name ? -1 : 1)
      .forEach(swagger => {
        fetchedSwaggers[swagger.name] = swagger;
      })

    return fetchedSwaggers
  }
}