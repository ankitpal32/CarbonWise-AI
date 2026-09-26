import { useState } from 'react'
import GlassCard from '../common/GlassCard'
import OptionSelector from './OptionSelector'
import {
  TRANSPORT_OPTIONS,
  ELECTRICITY_OPTIONS,
  FOOD_OPTIONS,
  PLASTIC_OPTIONS,
<<<<<<< HEAD
  validateCarbonInputs,
} from '../../data/carbonData'
import { IconCar, IconBus, IconTrain, IconBike, IconWalk, IconSparkles } from '../common/Icons'
=======
} from '../../data/carbonData'
import { IconCar, IconBus, IconTrain, IconBike, IconWalk } from '../common/Icons'
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882

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
<<<<<<< HEAD
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    const result = validateCarbonInputs({ transport, electricity, food, plastic })
    if (!result.valid) {
      setValidationError('Please select valid choices for all 4 categories.')
      return
    }

    onSubmit(result.sanitized)
=======

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ transport, electricity, food, plastic })
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  }

  return (
    <GlassCard className="p-6 sm:p-8">
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <OptionSelector
          label="1. Primary Transportation Mode"
=======
      <form onSubmit={handleSubmit} className="space-y-7">
        <OptionSelector
          label="Transportation"
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          options={transportWithIcons}
          value={transport}
          onChange={setTransport}
          columns={5}
<<<<<<< HEAD
          name="transport"
        />
        <OptionSelector
          label="2. Daily Electricity Consumption"
=======
        />
        <OptionSelector
          label="Electricity Usage"
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          options={ELECTRICITY_OPTIONS}
          value={electricity}
          onChange={setElectricity}
          columns={3}
<<<<<<< HEAD
          name="electricity"
        />
        <OptionSelector
          label="3. Dietary Preference"
=======
        />
        <OptionSelector
          label="Food Preference"
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          options={FOOD_OPTIONS}
          value={food}
          onChange={setFood}
          columns={3}
<<<<<<< HEAD
          name="food"
        />
        <OptionSelector
          label="4. Single-Use Plastic / Packaging"
=======
        />
        <OptionSelector
          label="Plastic Usage"
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          options={PLASTIC_OPTIONS}
          value={plastic}
          onChange={setPlastic}
          columns={3}
<<<<<<< HEAD
          name="plastic"
        />

        {validationError && (
          <p className="rounded-lg border border-signal-bad/20 bg-signal-bad/10 p-3 text-center text-xs text-signal-bad" role="alert">
            {validationError}
          </p>
        )}

        <button type="submit" className="btn-primary w-full py-3.5 text-base shadow-glow-moss">
          <IconSparkles className="w-4 h-4" />
          Calculate My Daily Footprint
=======
        />

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Calculate My Carbon Score
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
        </button>
      </form>
    </GlassCard>
  )
}
