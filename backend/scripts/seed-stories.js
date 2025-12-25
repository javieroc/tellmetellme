'use strict';

const { faker } = require('@faker-js/faker');

const COVER_IMAGE_URL =
  'https://res.cloudinary.com/dozd3b29e/image/upload/v1766324584/tellmetellme/vanlife1_a7a7792a0c.jpg';

async function createCoverImage() {
  const file = await strapi.db.query('plugin::upload.file').create({
    data: {
      name: 'vanlife1.jpg',
      alternativeText: 'Vanlife Cover Image',
      caption: 'Vanlife Cover Image',
      hash: 'vanlife1',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 123,
      url: COVER_IMAGE_URL,
      provider: 'cloudinary',
      provider_metadata: {
        public_id: 'tellmetellme/vanlife1_a7a7792a0c',
        resource_type: 'image',
        version_id: null,
        signature: null,
        format: 'jpg',
      },
    },
  });

  return file;
}

const AVATAR_IMAGE_URL =
  'https://res.cloudinary.com/dozd3b29e/image/upload/v1766574499/tellmetellme/saitama_347ea677bc.jpg';

  async function createAvatarImage() {
  const file = await strapi.db.query('plugin::upload.file').create({
    data: {
      name: 'saitama.jpg',
      alternativeText: 'Author Avatar',
      caption: 'Author Avatar',
      hash: 'saitama',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 64,
      url: AVATAR_IMAGE_URL,
      provider: 'cloudinary',
      provider_metadata: {
        public_id: 'tellmetellme/saitama_347ea677bc',
        resource_type: 'image',
        version_id: null,
        signature: null,
        format: 'jpg',
      },
    },
  });

  return file;
}

async function seedAuthors(avatarImage, count = 10) {
  console.log(`🌱 Seeding ${count} users + authors...`);

  const authors = [];

  const userService = strapi
    .plugin('users-permissions')
    .service('user');

  const authenticatedRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({
      where: { type: 'authenticated' },
    });

  if (!authenticatedRole) {
    throw new Error('Authenticated role not found');
  }

  for (let i = 0; i < count; i++) {
    const fullName = faker.person.fullName();
    const firstName = fullName.split(' ')[0];

    const email = faker.internet.email({ firstName }).toLowerCase();
    const username = faker.internet.username().toLowerCase();

    const user = await userService.add({
      username,
      email,
      password: 'Password123#',
      provider: 'local',
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
    });

    const author = await strapi.documents('api::author.author').create({
      data: {
        name: fullName,
        email,
        bio: faker.lorem.paragraph(),
        user: {
          connect: user.id,
        },
        avatar: avatarImage.id,
      },
    });

    authors.push(author);
  }

  console.log(`✨ Created ${authors.length} users + authors`);
  return authors;
}

async function seedStories(authors, coverImage, count = 100) {
  console.log(`🌱 Seeding ${count} stories...`);

  const authorIds = authors.map((a) => a.id);
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence(5).replace('.', '');
    const slug = faker.helpers.slugify(title).toLowerCase();

    const randomAuthorId =
      authorIds[Math.floor(Math.random() * authorIds.length)];

    tasks.push(
      strapi.documents('api::story.story').create({
        data: {
          title,
          slug,
          excerpt: faker.lorem.sentence(12),
          content: faker.lorem.paragraphs(4, '\n\n'),
          views: faker.number.int({ min: 0, max: 5000 }),
          coverImage: [coverImage.id],

          author: { connect: randomAuthorId },
        },
        status: 'published',
      })
    );
  }

  await Promise.all(tasks);
  console.log(`✨ Created ${count} stories`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  const coverImage = await createCoverImage();
  const avatarImage = await createAvatarImage();
  const authors = await seedAuthors(avatarImage, 10);
  await seedStories(authors, coverImage, 100);

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
