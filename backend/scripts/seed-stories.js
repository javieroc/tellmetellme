'use strict';

const { faker } = require('@faker-js/faker');

const COVER_IMAGE_URL =
  'https://res.cloudinary.com/dozd3b29e/image/upload/v1766324584/tellmetellme/vanlife1_a7a7792a0c.jpg';

async function createCoverImage() {
  // Always create the file entry in the database
  const file = await strapi.db.query('plugin::upload.file').create({
    data: {
      name: 'vanlife1.jpg',
      alternativeText: 'Vanlife Cover Image',
      caption: 'Vanlife Cover Image',
      hash: 'vanlife1',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 123, // fake size in KB
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

async function seedAuthors(count = 10) {
  console.log(`🌱 Seeding ${count} authors...`);

  const authors = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();

    const author = await strapi.documents('api::author.author').create({
      data: {
        name,
        email: faker.internet.email({ firstName: name.split(' ')[0] }),
        bio: faker.lorem.paragraph(),
      },
    });

    authors.push(author);
  }

  console.log(`✨ Created ${authors.length} authors`);
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

          // assign the same cover image to all stories
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

/**
 * Main entrypoint
 */
async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  const coverImage = await createCoverImage();
  const authors = await seedAuthors(10);
  await seedStories(authors, coverImage, 100);

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
