const { faker } = require('@faker-js/faker')

exports.seed = async function(knex) {
  const getFakeEvent = () => {
    return {
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      location: faker.location.city(),
    }
  }

  const getPricesByType = () => ({
    general: faker.number.int({ min: 1000, max: 10000 }),
    vip: faker.number.int({ min: 1000, max: 10000 }),
    premium: faker.number.int({ min: 1000, max: 10000 }),
  })

  const getFakeTicket = (eventId, pricesByType) => {
    const type = faker.helpers.arrayElement(['general', 'vip', 'premium'])
    return {
      event_id: eventId,
      status: faker.helpers.arrayElement(['available', 'sold', 'reserved']),
      type,
      price: pricesByType[type],
    }
  }

  const seed = async (table, amount, getRow) => {
    const rows = []
    for (let i = 0; i < amount; i++) {
      rows.push(getRow())
    }

    const seeds = await knex(table).insert(rows).returning('id')
    return seeds.map(seed => seed.id)
  }

  // create events and tickets for those events
  const eventsIds = await seed('events', 100, getFakeEvent)
  // create a 500 allotment of tickets for this event
  for (const eventId of eventsIds) {
    const pricesByType = getPricesByType()
    await seed('tickets', 500, () => getFakeTicket(eventId, pricesByType))
  }
}
