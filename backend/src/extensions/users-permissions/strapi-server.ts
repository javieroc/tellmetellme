// src/extensions/users-permissions/strapi-server.ts
export default (plugin) => {
  const originalAuthFactory = plugin.controllers.auth;

  plugin.controllers.auth = ({ strapi }) => {
    const authController = originalAuthFactory({ strapi });

    const originalRegister = authController.register;

    authController.register = async (ctx: any) => {
      strapi.log.info('✅ Custom register hook triggered');

      await originalRegister(ctx);

      const user = ctx.body?.user;
      if (!user) return;

      try {
        const existing = await strapi.db
          .query('api::author.author')
          .findOne({
            where: { user: user.id },
          });

        if (existing) {
          strapi.log.info('Author already exists');
          return;
        }

        await strapi.db.query('api::author.author').create({
          data: {
            name: user.username,
            email: user.email,
            user: {
              connect: user.id,
            },
          },
        });

        strapi.log.info('✅ Author created successfully');
      } catch (err) {
        strapi.log.error('❌ Error creating author', err);
      }
    };

    return authController;
  };

  return plugin;
};
