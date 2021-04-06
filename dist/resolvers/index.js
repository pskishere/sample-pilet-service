"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = require("graphql-type-json");
const apollo_server_express_1 = require("apollo-server-express");
const pilets_1 = require("../pilets");
const typeDefs = apollo_server_express_1.gql `
  scalar JSON

  type PiletMetadata {
    name: ID!
    description: String
    version: String
    author: PiletAuthor
    hash: String
    content: String
    link: String
    custom: JSON
    integrity: String
    requireRef: String
  }

  type PiletLicense {
    pilet: ID!
    author: PiletAuthor
    type: String
    text: String
  }

  type PiletAuthor {
    name: String
    email: String
  }

  type Query {
    pilets: [PiletMetadata]

    piletLicense(pilet: ID!): PiletLicense
  }
`;
const resolvers = {
    Query: {
        pilets(_parent, _args, _context) {
            return __awaiter(this, void 0, void 0, function* () {
                const pilets = yield pilets_1.latestPilets();
                return pilets;
            });
        },
        piletLicense(_parent, args, _context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { pilet: id } = args;
                const pilets = yield pilets_1.latestPilets();
                const [pilet] = pilets.filter(m => m.name === id);
                if (pilet) {
                    return {
                        pilet: pilet.name,
                        author: pilet.author,
                        type: pilet.license.type,
                        text: pilet.license.text,
                    };
                }
                return undefined;
            });
        },
    },
    JSON: graphql_type_json_1.GraphQLJSON,
};
function withGql(app) {
    const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
    server.applyMiddleware({ app, path: '/' });
    return app;
}
exports.withGql = withGql;
//# sourceMappingURL=index.js.map