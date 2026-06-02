import { Sequelize } from "sequelize";

let sequelize: Sequelize;

const g = global as any;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize("client", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  if (!g.frontendSequelizeInstance) {
    g.frontendSequelizeInstance = new Sequelize("client", "root", "", {
      host: "localhost",
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  sequelize = g.frontendSequelizeInstance;
}

export default sequelize;
