export const LabeledLine = fabric.util.createClass(fabric.Line, {
    type: 'labeledLine',
    label: '',
    initialize: function(points, options) {
        this.callSuper('initialize', options);
        this.label = options.label
    },
    _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.font = '15px Helvetica';
        ctx.fillStyle = '#333';
        ctx.translate(-20, 0);
        ctx.strokeText(this.label, 0, 0)
    },
    toObject: function(propertiesToInclude) {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            label: this.get('label')
        });
    }
})


