const { gql } = require('apollo-server');


// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    "Retrieve generic details about a Kong node."
    node: Node

    "Retrieve usage information about a node, with some basic information about the connections being processed by the underlying nginx process, the status of the database connection, and node’s memory usage."
    status: Status

    services: [Service]

    service(id: ID!): Service

    routes: [Route]

    route(id: ID!): Route

    consumers: [Consumer]

    consumer(id: ID!): Consumer

    plugins: [Plugin]

    plugin(id: ID!): Plugin
  }

  enum protocol {
    http
    https
  }

  type PlugingAvailability {
    "The Plugin name"
    name: String
    "Indicates whether this plugin is available on the server"
    available: Boolean
  }
  
  type NodePlugins {
    "Names of plugins that are installed on the node"
    available_on_server : [PlugingAvailability]
    """
    Names of plugins that are enabled/configured. 
    That is, the plugins configurations currently in the datastore shared by all Kong nodes.
    """
    enabled_in_cluster : [String]
  }

  "Generic details about a Kong node."
  type Node {
    hostname: String
    node_id: ID!
    lua_version: String
    plugins: NodePlugins
    #TODO configuration
    tagline: String
    version: String
  }

  "Metrics about the database."
  type DatabaseStatus {
    """
    A boolean value reflecting the state of the database connection. 
    Please note that this flag does not reflect the health of the database itself.
    """
    reachable : Boolean
  }

  type LuaShareDict {
    name: String
    "how much of said memory is in use"
    allocated_slabs: String
    "How much memory is dedicated for the specific shared dictionary"
    capacity: String
  }

  "Worker Memory Usage"
  type WorkerMemoryUsage {
    """
    HTTP submodule’s Lua virtual machine’s memory usage information, 
    as reported by collectgarbage("count"), for every active worker, 
    i.e. a worker that received a proxy call in the last 10 seconds.
    """
    http_allocated_gc: String
    "Worker’s process identification number."
    pid: Int
  }

  "Metrics about the memory usage."
  type MemoryUsage {
    "An array with all workers of the Kong node"
    workers_lua_vms: [WorkerMemoryUsage]
    "An array of information about dictionaries that are shared with all workers in a Kong node"
    lua_shared_dicts: [LuaShareDict]
  }

  "Metrics about the nginx HTTP/S server."
  type Server {
    "The total number of client requests."
    total_requests: Int
    "The current number of active client connections including Waiting connections."
    connections_active: Int
    "The total number of accepted client connections."
    connections_accepted: Int 
    """
    The total number of handled connections. 
    
    Generally, the parameter value is the same as accepts unless some resource limits have been reached.
    """
    connections_handled: Int 
    "The current number of connections where Kong is reading the request header."
    connections_reading: Int
    "The current number of connections where nginx is writing the response back to the client."
    connections_writing: Int
    "The current number of idle client connections waiting for a request."
    connections_waiting: Int
  }

  """
  Retrieve usage information about a node
  with some basic information about the connections being processed 
  by the underlying nginx process, the status of the database connection, 
  and node’s memory usage.
  """
  type Status {
    database: DatabaseStatus,
    # TODO: querystring arguments unit and scale for memory
    memory: MemoryUsage 
    server: Server
  }


  interface KongEntity {
    id: ID!
    created_at: Int
    "An optional set of strings associated with the entity, for grouping and filtering."
    tags: [String]
  }

  """
  Service entities are abstractions of each of your own upstream services. 
  Examples of Services would be a data transformation microservice, a billing API, etc.

  The main attribute of a Service is its URL (where Kong should proxy traffic to), which can be set as a single string or by specifying its protocol, host, port and path individually.

  Services are associated to Routes (a Service can have many Routes associated with it). 
  Routes are entry-points in Kong and define rules to match client requests. 
  Once a Route is matched, Kong proxies the request to its associated Service. 
  """
  type Service implements KongEntity {
    id: ID!
    created_at: Int
    tags: [String]
    updated_at: Int
    "The Service name."
    name: String
    "The number of retries to execute upon failure to proxy. Defaults to 5."
    retries: Int
    """
    The protocol used to communicate with the upstream. 
    It can be one of http or https. Defaults to "http"."
    """
    protocol: protocol!
    "The host of the upstream server."
    host: String!
    "The upstream server port. Defaults to 80."
    port: Int!
    "The path to be used in requests to the upstream server."
    path: String
    "The timeout in milliseconds for establishing a connection to the upstream server. Defaults to 60000."
    connect_timeout: Int
    "The timeout in milliseconds between two successive write operations for transmitting a request to the upstream server. Defaults to 60000."
    write_timeout: Int
    "The timeout in milliseconds between two successive read operations for transmitting a request to the upstream server. Defaults to 60000."
    read_timeout: Int
    routes: [Route]
    plugins: [Plugin]
  }


  """
  Route entities define rules to match client requests. 

  Each Route is associated with a Service, and a Service may have multiple Routes associated to it. 
  Every request matching a given Route will be proxied to its associated Service.
  """
  type Route implements KongEntity {
    id: ID!
    created_at: Int
    tags: [String]
    updated_at: Int
    name: String
    protocols: [protocol]
    hosts: [String]
    paths: [String]
    https_redirect_status_code: Int
    regex_priority: Int
    strip_path: Boolean
    preserve_host: Boolean
    service: Service
    plugins: [Plugin]
  }

  type Consumer implements KongEntity {
    id: ID!
    created_at: Int
    tags: [String]
    username: String
    custom_id: String
    plugins: [Plugin]
  }

  type Plugin implements KongEntity {
    id: ID!
    created_at: Int
    tags: [String]
    name: String
    route: Route
    service: Service
    consumer: Consumer
    run_on: String
    protocols: [protocol]
    enabled: Boolean
  }
`;

module.exports = typeDefs;