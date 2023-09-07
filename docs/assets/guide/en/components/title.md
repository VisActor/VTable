# title Introduction to the use of table titles
The Title component in the VTable table library allows you to configure the main title and subtitle of the table and apply different styles to them. This tutorial will guide you on how to use this feature effectively.

## Example and configuration introduction
Here is an example configuration:

```
title: {
      text: 'North American supermarket sales analysis',
      subtext: `The data includes 15 to 18 years of retail transaction data for North American supermarket`,
      orient: 'top',
      padding: 20,
      textStyle: {
        fontSize: 30,
        fill: 'black'
      },
      subtextStyle: {
        fontSize: 20,
        fill: 'blue'
      }
    },
```
In the example above, we set the main title to 'North American supermarket sales analysis' and the subtitle to 'The data includes 15 to 18 years of retail transaction data for North American supermarket'. Now let's walk through the customization options one by one:

- text: The text content of the main title.
- subtext: the text content of the subtitle.
- orient: the direction of the title. Can be set to 'top', 'bottom', 'left' or 'right', indicating that the title is at the top, bottom, left or right of the table. In the example, we set it to 'top', which means the title is at the top of the table.
- padding: the padding of the title. Can be set to a number that represents the spacing between the title and the edge of the table. In the example we set it to 20.
- textStyle: style setting for the main title. You can use this option to set style attributes such as font size and color. In the example we set the font size to 30 and the color to 'black'.
- subtextStyle: style setting for subtitle. You can use this option to set style attributes such as font size and color. In the example, we set the font size to 20 and the color to 'blue'.
By using the above configurations, you can customize the content and style of the main and subtitles to better meet your needs and design style.

Note that the above example only shows some of the configuration options for the title component! For more configuration, please go to [option description](https://visactor.io/vtable/option/ListTable#title.visible)