const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const EleventyPluginNavigation = require('@11ty/eleventy-navigation')

const EleventyPluginSyntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const rollupPluginCritical = require('rollup-plugin-critical').default
const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')

//const Image = require("@11ty/eleventy-img");
const imagesResponsiver = require('eleventy-plugin-images-responsiver');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

const EleventyPluginRss = require('@11ty/eleventy-plugin-rss')
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const metagen = require('eleventy-plugin-metagen');

const { resolve } = require('path')

module.exports = function (eleventyConfig) {

	eleventyConfig.addShortcode('tag', (arg) => `<div>${arg}</div>`);

	eleventyConfig.addPlugin(metagen);
	/*// https://www.11ty.dev/docs/plugins/image/
	// Generate PNG icon files and a link tag from a source SVG or PNG file
	eleventyConfig.addShortcode("favicon", async function (src) {

		// Remove preceding slash from image path if it exists
		src = src.startsWith("/") ? src.slice(1) : src;

		let metadata = await Image(src, {
			widths: [48, 192, 512],
			formats: ["png"],
			urlPath: "/",
			outputDir: "./_site/",
			filenameFormat: function (id, src, width, format, options) {
				const name = "favicon";
				return `${name}-${width}.${format}`;
			}
		});

		// Build the icon link tag
		let data = metadata.png[0];
		return `<link rel="icon" href="${data.url}" type="image/png">`;

	});
*/
	/*
	// Shortcode to generate a responsive project image
	eleventyConfig.addShortcode("generateImage", async function (params) {

		// Destructure the paramaters object and set some defaults
		let {
			src, // throw an error if src is missing
			alt = "",
			classes = "",
			loadingType = "lazy",
			viewportSizes = "",
			outputWidths = ["1080", "1800", "2400"],
			outputFormats = ["jpeg"],
			outputQualityJpeg = 75,
			outputQualityWebp = 75,
			outputQualityAvif = 75
		} = params;

		// Tina CMS prefixes uploaded img src with a forward slash (?)
		// Remove it from the image path if it exists
		src = src.startsWith("/") ? src.slice(1) : src;

		let metadata = await Image(src, {
			widths: outputWidths,
			sharpJpegOptions: { quality: outputQualityJpeg },
			sharpWebpOptions: { quality: outputQualityWebp },
			sharpAvifOptions: { quality: outputQualityAvif },
			formats: outputFormats,
			urlPath: "/assets/images/",
			outputDir: "./_site/assets/images/",
			cacheOptions: {
				// If image is a remote URL, this is the amount of time before 11ty fetches a fresh copy
				duration: "5y",
				directory: ".cache",
				removeUrlQueryParams: true,
			},
		});

		let lowsrc = metadata.jpeg[0];

		let orientation;

		// Detect and set image orientation
		if (lowsrc.width > lowsrc.height) {
			orientation = "landscape";
		} else if (lowsrc.width < lowsrc.height) {
			orientation = "portrait";
		} else {
			orientation = "square";
		}

		return `<picture class="${classes}" data-orientation="${orientation}">
			${Object.values(metadata).map(imageFormat => {
			return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${viewportSizes}">`;
		}).join("\n")}
				<img
					src="${lowsrc.url}"
					width="${lowsrc.width}"
					height="${lowsrc.height}"
					alt="${alt}"
          class="hover-fade"
					loading="${loadingType}"
					decoding="async">
			  </picture>`;

	});*/

	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy("public");

	// Plugins
	eleventyConfig.addPlugin(faviconsPlugin, {	
	});

	eleventyConfig.addPlugin(imagesResponsiver);
	eleventyConfig.addPlugin(lazyImagesPlugin);
	eleventyConfig.addPlugin(EleventyPluginNavigation)
	eleventyConfig.addPlugin(EleventyPluginRss)
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight)
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: true,
				// This puts CSS and JS in subfolders – remove if you want all of it to be in /assets instead
				rollupOptions: {
					output: {
						assetFileNames: 'assets/css/style.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js'
					},
					plugins: [rollupPluginCritical({
						criticalUrl: './_site/',
						criticalBase: './_site/',
						criticalPages: [
							{ uri: 'index.html', template: 'index' },
							{ uri: 'posts/index.html', template: 'posts/index' },
							{ uri: '404.html', template: '404' },
						],
						criticalConfig: {
							inline: true,
							dimensions: [
								{
									height: 900,
									width: 375,
								},
								{
									height: 720,
									width: 1280,
								},
								{
									height: 1080,
									width: 1920,
								}
							],
							penthouse: {
								forceInclude: ['.fonts-loaded-1 body', '.fonts-loaded-2 body'],
							}
						}
					})
					]
				}
			}
		}
	})

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	})

	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName])
	})

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})

	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// Customize Markdown library and settings:
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1, 2, 3, 4]
		}),
		slugify: eleventyConfig.getFilter('slug')
	})
	eleventyConfig.setLibrary('md', markdownLibrary)

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.njk')
	eleventyConfig.addLayoutAlias('post', 'post.njk')

	// Copy/pass-through files
	//eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')
	eleventyConfig.addPassthroughCopy('src/admin')

	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		passthroughFileCopy: true,
		dir: {
			input: 'src',
			// better not use "public" as the name of the output folder (see above...)
			output: '_site',
			includes: '_includes',
			layouts: 'layouts',
			data: '_data'
		}
	}
}
