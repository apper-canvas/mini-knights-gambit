// Settings service for managing game settings persistence
const SETTINGS_KEY = 'knightsGambitSettings'

const defaultSettings = {
  Id: 1,
  difficulty: 'intermediate',
  timeControl: 'rapid',
  playerName: '',
  autoSave: true,
  showHints: true,
  animationSpeed: 'normal'
}

// Simulate API delay for consistency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const settingsService = {
  async getSettings() {
    await delay(200)
    
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        return { ...defaultSettings, ...settings }
      }
      return { ...defaultSettings }
    } catch (error) {
      console.error('Error loading settings:', error)
      return { ...defaultSettings }
    }
  },

  async updateSettings(newSettings) {
    await delay(300)
    
    try {
      const current = await this.getSettings()
      const updated = {
        ...current,
        ...newSettings,
        Id: current.Id, // Preserve ID
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
      return { ...updated }
    } catch (error) {
      console.error('Error saving settings:', error)
      throw new Error('Failed to save settings')
    }
  },

  async resetSettings() {
    await delay(200)
    
    try {
      const reset = {
        ...defaultSettings,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(reset))
      return { ...reset }
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw new Error('Failed to reset settings')
    }
  }
}

export default settingsService