/* eslint-disable @typescript-eslint/no-explicit-any */
const getOrCreateTooltip = (chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  }) => {
    let tooltipEl = chart.canvas.parentNode.querySelector(".tooltip-el");
  
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.classList.add("tooltip-el");
      tooltipEl.style.background = "#FFFFFF";
      tooltipEl.style.boxShadow = "0px 2px 10px 0px #7C8DB51F";
      tooltipEl.style.borderRadius = "8px";
      tooltipEl.style.color = "#767676";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
  
      const table = document.createElement("table");
      table.style.margin = "0px";
      table.style.padding = "1.5rem 1.3rem";
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };
  

  
export const createDashboardChartTooltip = (context: {
    chart: any;
    tooltip: any;
  }) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);
  
      const tableHead = document.createElement("thead");
  
      titleLines.forEach((title: string) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = "0";
  
        const th = document.createElement("th");
        th.style.borderWidth = "0";
        th.style.fontFamily = "var(--manrope-font)";
        th.style.fontWeight = "500";
        th.style.fontSize = "14px";
        th.style.lineHeight = "18px";
  
        const text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];
  
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";
  
        if (typeof colors.backgroundColor != typeof "") {
          colors.backgroundColor = "#1AAF5D";
        }
  
        const td = document.createElement("td");
        td.style.borderWidth = "0";
        td.style.background = colors.backgroundColor;
        td.style.backgroundClip = "text";
        td.style.webkitTextFillColor = "text";
        td.style.color = colors.backgroundColor;
        td.style.fontFamily = "var(--manrope-font)";
        td.style.textAlign = "center";
        td.style.fontWeight = "700";
        td.style.fontSize = "16px";
        td.style.lineHeight = "24px";
  
        const text = document.createTextNode(
          body.toString().split(":")[1] || body.toString()
        );
  
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector("table");
  
      // Remove old children
      while (tableRoot?.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot?.appendChild(tableHead);
      tableRoot?.appendChild(tableBody);
    }
  
    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };
  