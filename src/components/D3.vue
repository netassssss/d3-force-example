<template>
  <div style="max-height: 100%; overflow: auto;">
    <div :id="randomId"></div>
    <button @click="addNodes">Add Nodes</button>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import { init, updateNodes } from '../store/actions';

const color = '#88B1D1';
export default {
  mounted() {
    this.$store.dispatch(init);
  },
  props: {
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 400,
    },
    options: {
      type: Object,
      default: () => ({
        withLabels: false,
      }),
    },
  },
  computed: {
    ...mapGetters({
      nodes: 'getNodes',
      links: 'getLinks',
    }),
  },
  data() {
    const randomId = Math.random().toString(36).substring(2);
    return {
      randomId,
      tooltip: null,
      simulation: null,
    };
  },
  /* eslint no-param-reassign: 0 */
  methods: {
    drag(simulation) {
      const dragstarted = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      };

      const dragged = (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      };

      const dragended = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      };

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    },
    createSimulation() {
      const simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links)
          .id((d) => d.id)
          .distance((d) => (d.source.group === 0 ? 120 : 400)))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(this.width / 1.5, this.height / 2))
        .velocityDecay(0.4)
        .alphaTarget(0.1);

      return simulation;
    },
    createLinks(svg, links) {
      const link = svg.append('g')
        .attr('stroke', color)
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 1);

      return link;
    },
    getRadius(circleItem) {
      return circleItem.radius;
    },
    getOpacity(circleItem) {
      return circleItem.visible ? 1 : 0.5;
    },
    innerMainText(nodes) {
      /* eslint no-console:0 */
      /* eslint no-unused-vars:0 */
      nodes
        .each((node) => {
          if (node.group === 0) {
            d3.select(this.parentNode)
              // .append('rect')
              // .attr('fill', '#88B1D1')
              // .attr('width', '50')
              // .attr('height', '30')
              .append('text')
              .text('Yes')
              .attr('font-size', '0.50em')
              .attr('dy', '1em')
              .attr('x', 5);
          }
        });
    },
    createNodes(svg, nodes) {
      const node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(this.drag(this.simulation));

      node.append('circle')
        // .on('click', (circle) => this.showTooltip(circle, svg))
        .attr('fill', (d) => d.color)
        .attr('stroke', (d) => d.border || '#fff')
        .attr('r', (t) => this.getRadius(t))
        .style('cursor', 'pointer');

      this.innerMainText(svg.selectAll('.node'));
      return node;
    },
    createLabelsOfNodes(node) {
      if (this.options.withLabels) {
        node.append('text')
          .attr('dx', 12)
          .attr('dy', '.35em')
          .attr('font-size', '0.35em')
          .text((d) => d.id);
      }
    },
    removeToolip() {
      if (this.tooltip) this.tooltip.remove();
    },
    showTooltip(circle, svg) {
      d3.event.preventDefault();
      if (circle.group === 0) return;
      this.removeToolip();
      this.tooltip = svg.append('g')
        .attr('transform', `translate(${circle.x + 20}, ${circle.y - 70})`)
        .attr('width', 100)
        .attr('height', 50);
      this.tooltip.append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .style('fill', 'white')
        .style('stroke', color);

      this.tooltip.append('text')
        .text(`Name: ${circle.id}`)
        .attr('font-size', '0.50em')
        .attr('dy', '1em')
        .attr('x', 5);

      // append shadow relative to the circle
      this.tooltip.append('path')
        .attr('d', 'M 0 0 L 120 -20 H 20 V -70 L 0 0')
        .attr('transform', 'translate(-20, 70)')
        .style('fill', color)
        .style('opacity', 0.2);

      this.addLinks(circle);
    },
    clickoutside() {
      document.getElementById(this.randomId).addEventListener('click', (event) => {
        if (event.target.nodeName !== 'circle') this.removeToolip();
      });
    },
    initForce() {
      const svg = d3.create('svg')
        .attr('viewBox', [0, 0, this.width * 1.3, this.height * 1.5]);

      this.simulation = this.createSimulation();
      const links = this.createLinks(svg, this.links);
      const nodes = this.createNodes(svg, this.nodes);
      this.createLabelsOfNodes(nodes);

      this.simulation.on('tick', () => {
        links
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)
          .style('opacity', (d) => (d.visible ? 0.6 : 0));

        nodes
          .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
          .attr('opacity', (t) => this.getOpacity(t));
      });

      return svg.node();
    },
    updateForce() {
      if (!this.simulation) return;
      // stop simulation and drag events
      this.simulation.stop();
      this.simulation
        .nodes(this.nodes)
        .alpha(1)
        .alphaTarget(1)
        .restart();
    },
    destroySvg() {
      d3.select('svg').remove();
    },
    addLinks(node) {
      this.$store.dispatch(updateNodes, { node });
    },
    addNodes() {
      this.$store.dispatch(updateNodes);
    },
  },
  destroyed() {
    this.destroySvg();
  },
  /* eslint no-debugger: 0 */
  watch: {
    nodes: {
      immediate: true,
      handler(newVal, oldVal) {
        if (this.nodes.length && oldVal && !oldVal.length) {
          this.$nextTick(() => {
            const svg = this.initForce();
            const parentNode = document.getElementById(this.randomId);
            parentNode.appendChild(svg);
            this.clickoutside();
          });
        } else if (this.nodes.length) {
          this.updateForce();
        }
      },
    },
  },
};
</script>

<style scoped>
  svg {
    height: 200%;
  }
</style>
