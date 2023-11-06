import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import fetch from "node-fetch"

let clients = [
  {
    "name": "Magui",
    "lastName": "Martinez"
  },
  {
    "name": "Json",
    "lastName": "Felino"
  },
  {
    "name": "Pelu",
    "lastName": "Echulep"
  }
]

const typeDefinitions = `
            type Query {
              clients: [Client],
              asteroidsNear: AsteroidsNear
            },
            type Mutation {
              addClient(name:String, lastName:String): Client
            },
            type Client {
              name: String,
              lastName: String
            },
            type AsteroidsNear{
              element_count: Int,
              near_earth_objects: NearEarthObjects,
              links: Links
            },
            type Links{
              next: String,
              prev: String,
              self: String
            },
            type MissDistance {
              astronomical: String,
              lunar: String,
              kilometers: String,
              miles: String,
            },
            type RelativeVelocity {
              kilometers_per_second: String,
              kilometers_per_hour: String,
              miles_per_hour: String,
            },
            type CloseApproachData {
              close_approach_date: String,
              close_approach_date_full: String,
              epoch_date_close_approach: Int,
              orbiting_body: String,
              miss_distance: MissDistance,
              relative_velocity: RelativeVelocity,
            },
            type Feet {
              estimated_diameter_min: Float,
              estimated_diameter_max: Float
            },
            type Miles {
              estimated_diameter_min: Float,
              estimated_diameter_max: Float
            },
            type Meters {
              estimated_diameter_min: Float,
              estimated_diameter_max: Float
            },
            type Kilometers {
              estimated_diameter_min: Float,
              estimated_diameter_max: Float
            },
            type EstimatedDiameter {
              feet: Feet,
              miles: Miles,
              meters: Meters,
              kilometers: Kilometers
            },
            type Today{
              id: String,
              neo_reference_id: String,
              name: String,
              nasa_jpl_url: String,
              absolute_magnitude_h: Float,
              is_potentially_hazardous_asteroid: Boolean,
              is_sentry_object: Boolean,
              close_approach_data: [CloseApproachData],
              estimated_diameter: EstimatedDiameter,
              links: Links
            },
            type NearEarthObjects {
              today: [Today]
            }
          `;

const resolvers = {
    Query: {
      clients: () => {
        return clients;
      },
      asteroidsNear: async () => {
        let response = await fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-11-06&end_date=2023-11-06&api_key=DEMO_KEY")
        response = await response.text();
        response = response.replaceAll("2023-11-06", "today")
        response = JSON.parse(response)
        return response;
      }
    },
    Mutation: {
      addClient: (_,data) => {
        let newClient = {
          "name": data.name,
          "lastName": data.lastName
        };
        clients.push(newClient);
        return newClient;
      }
    }
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefinitions,
    resolvers: resolvers,
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})