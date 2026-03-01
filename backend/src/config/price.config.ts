const pricingConfig = () => ({
  car: {
    baseFare: 50,
    perKm: 12,
    perMinute: 1.5,
  },
  auto: {
    baseFare: 30,
    perKm: 8,
    perMinute: 1,
  },
  motorcycle: {
    baseFare: 20,
    perKm: 5,
    perMinute: 0.5,
  }
})

export const price = pricingConfig()