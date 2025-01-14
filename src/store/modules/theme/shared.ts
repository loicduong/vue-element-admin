import { overrideThemeSettings, themeSettings } from '@/theme/settings'
import { themeVars } from '@/theme/vars'
import { toggleHtmlClass } from '@/utils/common'
import { localStg } from '@/utils/storage'
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '@sa/color'
import { defu } from 'defu'

const DARK_CLASS = 'dark'

/** Init theme settings */
export function initThemeSettings() {
  const isProd = import.meta.env.PROD

  // if it is development mode, the theme settings will not be cached, by update `themeSettings` in `src/theme/settings.ts` to update theme settings
  if (!isProd)
    return themeSettings

  // if it is production mode, the theme settings will be cached in localStorage
  // if want to update theme settings when publish new version, please update `overrideThemeSettings` in `src/theme/settings.ts`

  const localSettings = localStg.get('themeSettings')

  let settings = defu(localSettings, themeSettings)

  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

  if (!isOverride) {
    settings = defu(overrideThemeSettings, settings)

    localStg.set('overrideThemeFlag', BUILD_TIME)
  }

  return settings
}

/**
 * create theme token css vars value by theme settings
 *
 * @param colors Theme colors
 * @param tokens Theme setting tokens
 * @param [recommended] Use recommended color. Default is `false`
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false,
) {
  const paletteColors = createThemePaletteColors(colors, recommended)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      ...light.colors,
    },
    boxShadow: {
      ...light.boxShadow,
    },
  }

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors,
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow,
    },
  }

  return {
    themeTokens,
    darkThemeTokens,
  }
}

/**
 * Create theme palette colors
 *
 * @param colors Theme colors
 * @param [recommended] Use recommended color. Default is `false`
 */
function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key], recommended)

    colorPaletteVar[key] = colorMap.get(500)!

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

/**
 * Get css var by tokens
 *
 * @param tokens Theme base tokens
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const styles: string[] = []

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '')
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '')
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue)
      let cssValue = tokens[key][tokenKey]

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgb(cssValue)
        cssValue = `${r} ${g} ${b}`
      }

      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  const styleStr = styles.join(';')

  return styleStr
}

/**
 * Add theme vars to global
 *
 * @param tokens
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens)
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `
    :root {
      ${cssVarStr}
    }
  `

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `

  const styleId = 'theme-vars'

  const style = document.querySelector(`#${styleId}`) || document.createElement('style')

  style.id = styleId

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

/**
 * Toggle css dark mode
 *
 * @param darkMode Is dark mode
 */
export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass(DARK_CLASS)

  if (darkMode) {
    add()
  }
  else {
    remove()
  }
}

/**
 * Toggle auxiliary color modes
 *
 * @param grayscaleMode
 * @param colourWeakness
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  const htmlElement = document.documentElement
  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
    .filter(Boolean)
    .join(' ')
}

type UIColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'
type UIColorKey = `${App.Theme.ThemeColorKey}Color${UIColorScene}`
type UIThemeColor = Partial<Record<UIColorKey, string>>
interface UIColorAction {
  scene: UIColorScene
  handler: (color: string) => string
}

/**
 * Get UI theme colors
 *
 * @param colors Theme colors
 * @param [recommended] Use recommended color. Default is `false`
 */
function getUiThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorActions: UIColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => getPaletteColorByNumber(color, 500, recommended) },
    { scene: 'Pressed', handler: color => getPaletteColorByNumber(color, 700, recommended) },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) },
  ]

  const themeColors: UIThemeColor = {}

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach((color) => {
    colorActions.forEach((action) => {
      const [colorType, colorValue] = color
      const colorKey: UIColorKey = `${colorType}Color${action.scene}`
      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}

/**
 * Get UI theme
 *
 * @param colors Theme colors
 * @param [recommended] Use recommended color. Default is `false`
 */
export function getUiTheme(colors: App.Theme.ThemeColor, recommended = false) {
  const { primary: colorLoading } = colors

  const theme = {
    common: {
      ...getUiThemeColors(colors, recommended),
      borderRadius: '6px',
    },
    LoadingBar: {
      colorLoading,
    },
    Tag: {
      borderRadius: '6px',
    },
  }

  return theme
}
