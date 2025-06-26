import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from '../atoms/Button'
import ApperIcon from '../atoms/ApperIcon'
import settingsService from '../../services/settingsService'

const SettingsModal = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      difficulty: 'intermediate',
      timeControl: 'rapid',
      playerName: '',
      autoSave: true,
      showHints: true,
      animationSpeed: 'normal'
    }
  })

  // Load current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCurrentSettings()
    }
  }, [isOpen])

  const loadCurrentSettings = async () => {
    try {
      const settings = await settingsService.getSettings()
      reset(settings)
    } catch (error) {
      toast.error('Failed to load settings')
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const updatedSettings = await settingsService.updateSettings(data)
      onSettingsUpdate?.(updatedSettings)
      toast.success('Settings saved successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to default values?')) {
      return
    }

    setIsResetting(true)
    try {
      const defaultSettings = await settingsService.resetSettings()
      reset(defaultSettings)
      onSettingsUpdate?.(defaultSettings)
      toast.success('Settings reset to defaults')
    } catch (error) {
      toast.error('Failed to reset settings')
    } finally {
      setIsResetting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Easier AI, more hints' },
    { value: 'intermediate', label: 'Intermediate', description: 'Balanced gameplay' },
    { value: 'advanced', label: 'Advanced', description: 'Challenging AI' },
    { value: 'expert', label: 'Expert', description: 'Maximum difficulty' }
  ]

  const timeControlOptions = [
    { value: 'blitz', label: 'Blitz', description: '3 minutes' },
    { value: 'rapid', label: 'Rapid', description: '10 minutes' },
    { value: 'classical', label: 'Classical', description: '30 minutes' },
    { value: 'unlimited', label: 'Unlimited', description: 'No timer' }
  ]

  const animationSpeedOptions = [
    { value: 'slow', label: 'Slow' },
    { value: 'normal', label: 'Normal' },
    { value: 'fast', label: 'Fast' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="premium-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Settings" size={24} className="text-accent" />
                <h2 className="text-2xl font-display text-secondary">Game Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-secondary/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Difficulty Settings */}
              <div>
                <h3 className="text-lg font-display text-secondary/90 mb-4 flex items-center space-x-2">
                  <ApperIcon name="Target" size={18} />
                  <span>Difficulty Level</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {difficultyOptions.map((option) => (
                    <label
                      key={option.value}
                      className="premium-card p-4 cursor-pointer hover:bg-secondary/5 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          value={option.value}
                          {...register('difficulty')}
                          className="mt-1 text-accent focus:ring-accent"
                        />
                        <div>
                          <div className="font-medium text-secondary">{option.label}</div>
                          <div className="text-sm text-secondary/60">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Control Settings */}
              <div>
                <h3 className="text-lg font-display text-secondary/90 mb-4 flex items-center space-x-2">
                  <ApperIcon name="Clock" size={18} />
                  <span>Time Control</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timeControlOptions.map((option) => (
                    <label
                      key={option.value}
                      className="premium-card p-4 cursor-pointer hover:bg-secondary/5 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          value={option.value}
                          {...register('timeControl')}
                          className="mt-1 text-accent focus:ring-accent"
                        />
                        <div>
                          <div className="font-medium text-secondary">{option.label}</div>
                          <div className="text-sm text-secondary/60">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Player Preferences */}
              <div>
                <h3 className="text-lg font-display text-secondary/90 mb-4 flex items-center space-x-2">
                  <ApperIcon name="User" size={18} />
                  <span>Player Preferences</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary/80 mb-2">
                      Player Name (Optional)
                    </label>
                    <input
                      type="text"
                      {...register('playerName')}
                      className="w-full px-3 py-2 bg-secondary/5 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-secondary"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary/80 mb-2">
                      Animation Speed
                    </label>
                    <select
                      {...register('animationSpeed')}
                      className="w-full px-3 py-2 bg-secondary/5 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-secondary"
                    >
                      {animationSpeedOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('autoSave')}
                        className="text-accent focus:ring-accent rounded"
                      />
                      <span className="text-secondary">Auto-save games</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('showHints')}
                        className="text-accent focus:ring-accent rounded"
                      />
                      <span className="text-secondary">Show move hints</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-secondary/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={isLoading || isResetting}
                  className="flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="RotateCcw" size={16} />
                  <span>{isResetting ? 'Resetting...' : 'Reset to Defaults'}</span>
                </Button>
                
                <div className="flex gap-3 sm:ml-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || !isDirty}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Save" size={16} />
                    <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SettingsModal