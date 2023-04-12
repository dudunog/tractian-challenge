export type Asset = {
  id: string
  sensors: Sensors
  model: string
  status: string
  healthscore: number
  name: string
  image: string
  metrics: Metrics
  specifications: Specifications
  unitId?: string
  unitName?: string
  companyId?: string
  companyName?: string
  lastUptimeAt: string
}

type Sensors = {
  "0": string
}

type Metrics = {
  totalCollectsUptime: number
  totalUptime: number
  lastUptimeAt: string
}

type Specifications = {
  rpm?: number
  maxTemp: number
  power?: number
}
