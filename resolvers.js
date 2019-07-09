module.exports = {
  Query: {
    node: async (_, __, {dataSources}) => await dataSources.kongAdminAPI.getNode(),
    status: async (_, __, {dataSources}) => dataSources.kongAdminAPI.getStatus(),
    services: async (_, __, {dataSources}) => dataSources.kongAdminAPI.getAllServices(),
    service: async (_, { id } , {dataSources}) => dataSources.kongAdminAPI.getServiceByID(id),
    routes: async (_, __, {dataSources}) => dataSources.kongAdminAPI.getAllRoutes(),  
    route: async (_, { id } , {dataSources}) => dataSources.kongAdminAPI.getRouteByID(id),  
    consumers: async (_, __, {dataSources}) => dataSources.kongAdminAPI.getAllConsumers(), 
    consumer: async (_, { id } , {dataSources}) => dataSources.kongAdminAPI.getConsumerByID(id),  
    plugins: async (_, __, {dataSources}) => dataSources.kongAdminAPI.getAllPlugins(),  
    plugin: async (_, { id } , {dataSources}) => dataSources.kongAdminAPI.getPluginByID(id),  
  },
  KongEntity: {
    __resolveType(entity, context, info) {
      if(entity.routes) return 'Service';
      if(entity.https_redirect_status_code) return 'Route';
      if(entity.username) return 'Consumer';
      if(entity.run_on) return 'Plugin';
    }
  },
  Service: {
    routes: async (service, __, {dataSources}) => dataSources.kongAdminAPI.getServiceRoutes(service),
    plugins: async (service, __, {dataSources}) => dataSources.kongAdminAPI.getServicePlugins(service),
  },
  Route: {
    service: async (route, __, {dataSources}) => dataSources.kongAdminAPI.getServiceByID(route.service.id),
    plugins: async (route, __, {dataSources}) => dataSources.kongAdminAPI.getRoutePlugins(route)
  },
  Consumer: {
    plugins: async (consumer, __, {dataSources}) => dataSources.kongAdminAPI.getConsumerPlugins(consumer)
  },
  Plugin: {
    service: async (plugin, __, {dataSources}) => {
      if(plugin.service != null && plugin.service.id != null)
        return await dataSources.kongAdminAPI.getServiceByID(plugin.service.id)      
      },
    route: async (plugin, __, {dataSources}) => {
      if(plugin.route != null && plugin.route.id != null)
        return await dataSources.kongAdminAPI.getRouteByID(plugin.route.id)
      },
    consumer: async (plugin, __, {dataSources}) => {
      if(plugin.consumer != null && plugin.consumer.id != null)
        return await dataSources.kongAdminAPI.getConsumerByID(plugin.consumer.id)
      }
  }

}