//import '/assets/css/main.scss'

// Internal Modules
import './modules/nav'

import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
Alpine.plugin(focus)
window.Alpine = Alpine

// Add Alpine extensions here

Alpine.start()
