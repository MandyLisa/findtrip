import { loadStripe } from '@stripe/stripe-js'

// ใส่ Stripe Publishable Key ที่ได้จาก Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default stripePromise
