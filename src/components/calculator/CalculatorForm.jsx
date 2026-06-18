import { useState } from 'react'
import GlassCard from '../common/GlassCard'
import OptionSelector from './OptionSelector'
import {
  TRANSPORT_OPTIONS,
  ELECTRICITY_OPTIONS,
  FOOD_OPTIONS,
  PLASTIC_OPTIONS,
} from '../../data/carbonData'
import { IconCar, IconBus, IconTrain, IconBike, IconWalk } from '../common/Icons'

const TRANSPORT_ICONS = {
  car: <IconCar className="w-5 h-5" />,
  bus: <IconBus className="w-5 h-5" />,
  train: <IconTrain className="w-5 h-5" />,
  bicycle: <IconBike className="w-5 h-5" />,
  walking: <IconWalk className="w-5 h-5" />,
}

const transportWithIcons = TRANSPORT_OPTIONS.map((o) => ({ ...o, icon: TRANSPORT_ICONS[o.id] }))

export default function CalculatorForm({ initialValues, onSubmit }) {
  const [transport, setTransport] = useState(initialValues?.transport || 'car')
  const [electricity, setElectricity] = useState(initialValues?.electricity || 'medium')
  const [food, setFood] = useState(initialValues?.food || 'mixed')
  const [plastic, setPlastic] = useState(initialValues?.plastic || 'medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ transport, electricity, food, plastic })
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-7">
        <OptionSelector
          label="Transportation"
          options={transportWithIcons}
          value={transport}
          onChange={setTransport}
          columns={5}
        />
        <OptionSelector
          label="Electricity Usage"
          options={ELECTRICITY_OPTIONS}
          value={electricity}
          onChange={setElectricity}
          columns={3}
        />
        <OptionSelector
          label="Food Preference"
          options={FOOD_OPTIONS}
          value={food}
          onChange={setFood}
          columns={3}
        />
        <OptionSelector
          label="Plastic Usage"
          options={PLASTIC_OPTIONS}
          value={plastic}
          onChange={setPlastic}
          columns={3}
        />

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Calculate My Carbon Score
        </button>
      </form>
    </GlassCard>
  )
}
