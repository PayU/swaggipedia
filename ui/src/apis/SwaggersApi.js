const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '@@@PUBLIC_API@@@'

export default class SwaggersApi {
  static resourceEndpoint = `${SERVICE_URL}/v1/swaggers`

  // Get
  static async fetchSwaggers() {
    const fetchedSwaggers = {};

    (await (await fetch(this.resourceEndpoint)).json())
      .sort((a, b) => a.title < b.title ? -1 : 1)
      .forEach(swagger => {
        fetchedSwaggers[swagger.id] = swagger;
      })

    return fetchedSwaggers
  }

  static async fetchSwaggerContent(swaggerId) {
    return (await (await fetch(`${this.resourceEndpoint}/${swaggerId}`)).json())
  }

  // Put
  static async updateSwagger(swaggerId, swaggerProps) {
    const response = await fetch(`${this.resourceEndpoint}/${swaggerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swaggerProps)
    })

    return response.status === 200;
  }
}