/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
// export const up = (pgm) => {};
exports.up = (pgm) => {

  pgm.createTable("users", {

    id: "id",

    email: {
      type: "text",
      notNull: true,
      unique: true
    },

    password: {
      type: "text",
      notNull: true
    },

    role: {
      type: "text",
      default: "user"
    }

  });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
