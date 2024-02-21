**DSC106 Project 3 Writeup**

_Group members: Nicholas Jumaoas, Jiaqing Yan, Yosen Lin_

After deciding to use Jiaqing’s WHO tobacco usage dataset for our visualization, we very quickly settled on using a choropleth map as the base structure for our visualization since it allows differences in geographic distributions to be conveyed directly and evocatively. Building off of that, we took inspiration from examples from the labs and the D3 website and decided to implement filters for gender and time, as well as adding a hover-based tooltip that displays country name and its percentage of tobacco usage. While a dropdown menu felt like the most intuitive interaction technique for the gender display, we chose a slider over the dropdown menu showcased on the WHO website for the time slider because it allows the viewer to more seamlessly experience how the distribution of tobacco usage has changed over time.

Our development process consisted of data cleaning, the construction of the base choropleth, and then the implementation of the tooltip as well as gender and time series filters and their corresponding interactive elements. After considering scheduling limitations of group members, the work was assigned as follows:

|          |                                                    |
| :------: | :------------------------------------------------: |
| **Name** |                **Responsibilities**                |
| Nicholas |          Base choropleth, tooltip, writeup         |
|  Jiaqing | Gender filter, data cleaning, gender dropdown menu |
|   Yosen  |           Time series filter, year slider          |

Including both development of the visualization itself as well as external work such as the data cleaning and writeup, our group spent approximately 22 hours working on this project, encountering various obstacles ranging from missing data to messy file structures. In particular, the missing data caused various iterations of the slider implementation to be plagued by bugs. We fixed it by making the slider more discrete. Additionally, there were general struggles involving straightening out the logic behind the interactive graph itself as well as the JavaScript/Svelte code behind it.
