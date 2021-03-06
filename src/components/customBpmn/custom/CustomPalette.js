/*import { assign } from "min-dash";

export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  handTool,
  lassoTool,
  spaceTool,
  globalConnect,
  translate
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.handTool = handTool;
  this.lassoTool = lassoTool;
  this.spaceTool = spaceTool;
  this.globalConnect = globalConnect;
  this.translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "handTool",
  "lassoTool",
  "spaceTool",
  "globalConnect",
  "translate"
];

PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    create,
    elementFactory,
    handTool,
    lassoTool,
    spaceTool,
    globalConnect,
    translate
  } = this;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, "");

    return {
      group: group,
      className: className,
      title: title || translate("Create {type}", { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  return {
    "hand-tool": {
      group: "tools",
      className: "bpmn-icon-hand-tool",
      title: "Activate the hand tool",
      action: {
        click: function (event) {
          handTool.activateHand(event);
        }
      }
    },
    "lasso-tool": {
      group: "tools",
      className: "bpmn-icon-lasso-tool",
      title: "Activate the lasso tool",
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    "space-tool": {
      group: "tools",
      className: "bpmn-icon-space-tool",
      title: "Activate the create/remove space tool",
      action: {
        click: function (event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    "global-connect-tool": {
      group: "tools",
      className: "bpmn-icon-connection-multi",
      title: "Activate the global connect tool",
      action: {
        click: function (event) {
          globalConnect.toggle(event);
        }
      }
    },
    "tool-separator": {
      group: "tools",
      separator: true
    },

    "create.start-event": createAction(
      "bpmn:StartEvent",
      "event",
      "bpmn-icon-start-event-none",
      "??????????????????"
    ),
    "create.intermediate-catch-event": createAction(
      "bpmn:IntermediateThrowEvent",
      "event",
      "bpmn-icon-intermediate-event-none",
      "Create Intermediate/Boundary Event"
    ),
    "create.end-event": createAction(
      "bpmn:EndEvent",
      "event",
      "bpmn-icon-end-event-none",
      "??????????????????"
    ),
    "create.gateway": createAction(
      "bpmn:Gateway",
      "gateway",
      "bpmn-icon-gateway-none",
      "????????????"
    ),
    
    "create.task": createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-task-none",
      "????????????"
    ),
    "create.expanded-subprocess": createAction(
      "bpmn:ExpandedSubprocess",
      "activity",
      "bpmn-icon-expanded-subprocess-none",
      "??????????????????"
    ),
    "create.scripttask": createAction(
      "bpmn:ScriptTask",
      "activity",
      "bpmn-icon-script-task",
      "??????????????????"
    ),
    
    
    "create.participant": createAction(
      "bpmn:Participant",
      "collaboration",
      "bpmn-icon-participant",
      "????????????/??????"
    ),
    "create.group": createAction(
      "bpmn:Group",
      "collaboration",
      "bpmn-icon-group",
      "?????? Group"
    )
  };
};
*/

import {
  assign
} from 'min-dash';


/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool,
    globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect,
      translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createSubprocess(event) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    });

    create.start(event, [ subProcess, startEvent ], {
      hints: {
        autoSelect: [ startEvent ]
      }
    });
  }

  function createParticipant(event) {
    create.start(event, elementFactory.createParticipantShape());
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('??????????????????'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('??????????????????'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('????????????/??????????????????'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('????????????????????????'),
      action: {
        click: function(event) {
          globalConnect.toggle(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('??????????????????')
    ),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
      translate('????????????/????????????')
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('??????????????????')
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
      translate('????????????')
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task',
      translate('????????????')
    ),
    'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
      translate('????????????????????????')
    ),
    'create.data-store': createAction(
      'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
      translate('????????????????????????')
    ),
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'bpmn-icon-subprocess-expanded',
      title: translate('????????????????????????'),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess
      }
    },
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate('?????????/?????????'),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    },
    'create.group': createAction(
      'bpmn:Group', 'artifact', 'bpmn-icon-group',
      translate('?????????')
    ),
  });

  return actions;
};
