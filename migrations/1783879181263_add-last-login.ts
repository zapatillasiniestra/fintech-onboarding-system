exports.up = (pgm) => {
  pgm.addColumn("users", {
    last_login: {
      type: "timestamp"
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("users", "last_login");
};