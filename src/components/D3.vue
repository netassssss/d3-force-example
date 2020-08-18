<template>
  <div :id="randomId"></div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import { init } from '../store/actions';

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
    createSimulation1() {
      const attractForce = d3.forceManyBody()
        .strength(10)
        .distanceMax(this.width)
        .distanceMin(this.width / 10);
      const repelForce = d3.forceManyBody()
        .strength(-10)
        .distanceMax(this.width / 12)
        .distanceMin(this.width / 60);
      const link = d3.forceLink(this.links)
        .id((d) => d.id)
        .distance(0);

      const simulation = d3.forceSimulation(this.nodes)
        .alphaDecay(0.03)
        .force('attractForce', attractForce)
        .force('repelForce', repelForce)
        .force('link', link)
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .on('tick', () => {
          this.nodes[0].x = this.width / 2;
          this.nodes[0].y = this.height / 2;
        });

      return simulation;
    },
    createSimulation() {
      const simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links).id((d) => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(this.width / 2, this.height / 2));

      return simulation;
    },
    createLinks(svg) {
      const link = svg.append('g')
        .attr('stroke', '#ff0000')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr('stroke-width', 1);

      return link;
    },
    getRadius(circleItem) {
      if (circleItem.id.toLowerCase().indexOf('tagaim') > -1) return 3;
      return (circleItem.id.toLowerCase().indexOf('step') > -1 ? 10 : 5);
    },
    createNodes(svg, simulation) {
      const node = svg.selectAll('.node')
        .data(this.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(this.drag(simulation));

      node.append('circle')
        .on('click', (circle) => this.showTooltip(circle, svg))
        .attr('fill', '#ff0000')
        .attr('r', (t) => this.getRadius(t))
        .style('cursor', (t) => (t.id.toLowerCase().indexOf('step') > -1 ? 'pointer' : 'default'));

      node.append('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .attr('font-size', '0.35em')
        .text((d) => d.id);

      return node;
    },
    removeToolip() {
      if (this.tooltip) this.tooltip.remove();
    },
    showTooltip(circle, svg) {
      d3.event.preventDefault();
      this.removeToolip();
      this.tooltip = svg.append('g')
        .attr('transform', `translate(${circle.x + 20}, ${circle.y - 70})`)
        .attr('width', 100)
        .attr('height', 50);
      this.tooltip.append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .style('fill', 'white')
        .style('stroke', '#ff0000');

      this.tooltip.append('text')
        .text(`Name: ${circle.id}`)
        .attr('font-size', '0.50em')
        .attr('dy', '1em')
        .attr('x', 5);

      // append shadow relative to the circle
      this.tooltip.append('path')
        .attr('d', 'M 0 0 L 120 -20 H 20 V -70 L 0 0')
        .attr('transform', 'translate(-20, 70)')
        .style('fill', '#ff0000')
        .style('opacity', 0.2);
    },
    clickoutside() {
      document.getElementById(this.randomId).addEventListener('click', (event) => {
        if (event.target.nodeName !== 'circle') this.removeToolip();
      });
    },
    initForce() {
      const svg = d3.create('svg')
        .attr('viewBox', [0, 0, this.width, this.height]);

      const simulation = this.createSimulation();
      const links = this.createLinks(svg);
      const nodes = this.createNodes(svg, simulation);

      simulation.on('tick', () => {
        links
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        // nodes
        //   .attr('cx', (d) => d.x)
        //   .attr('cy', (d) => d.y);
        nodes
          .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      });

      // this.createLabels(svg);
      return svg.node();
    },
  },
  watch: {
    nodes: {
      immediate: true,
      handler() {
        if (this.nodes.length) {
          this.$nextTick(() => {
            const svg = this.initForce();
            const parentNode = document.getElementById(this.randomId);
            parentNode.appendChild(svg);
            this.clickoutside();
          });
        }
      },
    },
  },
};
</script>

<style scoped lang="scss">
</style>
