'use strict';

const { faker } = require('@faker-js/faker');

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

async function seedStories(authors, count = 100) {
  console.log(`🌱 Seeding ${count} stories...`);

  const authorIds = authors.map(a => a.id);
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence(5).replace('.', '');
    const slug = faker.helpers.slugify(title).toLowerCase();
    const excerpt = faker.lorem.sentence(12);
    const content = faker.lorem.paragraphs(4, '\n\n');

    const randomAuthorId = authorIds[Math.floor(Math.random() * authorIds.length)];

    tasks.push(
      strapi.documents('api::story.story').create({
        data: {
          title,
          slug,
          excerpt,
          content,
          views: faker.number.int({ min: 0, max: 5000 }),
          author: { connect: randomAuthorId },
        },
        status: 'published'
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

  const authors = await seedAuthors(10);
  await seedStories(authors, 100);

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
