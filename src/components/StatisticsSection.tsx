import { getSiteConfig } from '../lib/firestore'
import StatisticsClient from './StatisticsClient'

export default async function StatisticsSection() {
  const config = await getSiteConfig()
  const stats = config.stats ?? []
  return <StatisticsClient stats={stats} />
}
