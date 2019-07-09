
const { RESTDataSource } = require('apollo-datasource-rest');

class KongAdminAPI extends RESTDataSource {

  constructor() {
    super();
    this.baseURL = "http://localhost:8001/";
  }

  async getNode() {
    const res = await this.get('');

    // TODO: null checks
    const dict = res.plugins.available_on_server;
    res.plugins.available_on_server = 
      Object.keys(dict).map(
        function(key) {
          return {
              "name" : key, 
              "available" : dict[key]
             }})

    return res;
  }

  async getStatus() {
    const res = await this.get('status');

    // TODO: null checks
    const dict = res.memory.lua_shared_dicts;
    res.memory.lua_shared_dicts = 
      Object.keys(dict).map(
        function(key) {
          return {
              "name" : key, 
              "allocated_slabs" : dict[key].allocated_slabs,
              "capacity" : dict[key].capacity
             }})

    return res;
  }

  async getAllServices() {
    const res = await this.get('services');

    // TODO: Null check and pagination
    return res.data;
  }

  async getServiceByID(serviceId) {
    const res = await this.get(`services/${serviceId}`);
    return res;
  }

  async getAllRoutes() {
    const res = await this.get('routes');

    // TODO: Null check and pagination
    return res.data;
  }

  async getRouteByID(routeId) {
    const res = await this.get(`routes/${routeId}`);
    return res;
  }

  async getServiceRoutes(service) {
    const res = await this.get(`/services/${service.id}/routes`);

    // TODO: Null check and pagination
    return res.data;
  }

  async getAllConsumers() {
    const res = await this.get('consumers');

    // TODO: Null check and pagination
    return res.data;
  }

  async getConsumerByID(consumerId) {
    const res = await this.get(`consumers/${consumerId}`);
    return res;
  }

  async getAllPlugins() {
    const res = await this.get('plugins');

    // TODO: Null check and pagination
    return res.data;
  }

  async getPluginByID(pluginId) {
    const res = await this.get(`plugins/${pluginId}`);
    return res;
  }

  async getRoutePlugins(route) {
    const res = await this.get(`/routes/${route.id}/plugins`);
    
    // TODO: Null check and pagination
    return res.data;
  }

  async getServicePlugins(service) {
    const res = await this.get(`/services/${service.id}/plugins`);
    
    // TODO: Null check and pagination
    return res.data;
  }

  async getConsumerPlugins(consumer) {
    const res = await this.get(`/consumers/${consumer.id}/plugins`);
    
    // TODO: Null check and pagination
    return res.data;
  }

}

module.exports = KongAdminAPI;