
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced design system colors
				'text-primary': 'hsl(var(--text-primary))',
				'text-secondary': 'hsl(var(--text-secondary))',
				'text-accent': 'hsl(var(--text-accent))',
				'surface-primary': 'hsl(var(--surface-primary))',
				'surface-secondary': 'hsl(var(--surface-secondary))',
				'surface-tertiary': 'hsl(var(--surface-tertiary))',
				'surface-glass': 'hsl(var(--surface-glass))',
				'news-accent': 'hsl(var(--news-accent))',
				'news-accent-light': 'hsl(var(--news-accent-light))',
				'insight-bg': 'hsl(var(--insight-bg))',
				'favorite-star': 'hsl(var(--favorite-star))',
				'hover-overlay': 'hsl(var(--hover-overlay))',
				'active-overlay': 'hsl(var(--active-overlay))',
				'glass-border': 'hsl(var(--glass-border))',
				
				// Category colors
				'ai-primary': 'hsl(var(--ai-primary))',
				'ai-secondary': 'hsl(var(--ai-secondary))',
				'marketing-primary': 'hsl(var(--marketing-primary))',
				'marketing-secondary': 'hsl(var(--marketing-secondary))',
				'finance-primary': 'hsl(var(--finance-primary))',
				'finance-secondary': 'hsl(var(--finance-secondary))',
				'international-primary': 'hsl(var(--international-primary))',
				'international-secondary': 'hsl(var(--international-secondary))',
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				space: ['Space Grotesk', 'sans-serif'],
			},
			fontSize: {
				'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
				'section': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			backdropBlur: {
				'xs': '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--news-accent))/20' },
					'50%': { boxShadow: '0 0 40px hsl(var(--news-accent))/40' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						transform: 'scale(1)',
						filter: 'brightness(1)'
					},
					'50%': { 
						transform: 'scale(1.05)',
						filter: 'brightness(1.1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'shimmer': 'shimmer 2s infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
