(function (root) {
	/**
	 *
	 * @returns {DOMEventTracker}
	 * @constructor
	 */
	function DOMEventTracker() {
		/**
		 *
		 * @type {{}}
		 * @private
		 */
		this._listeners = {};
		/**
		 *
		 * @type {{prototype: Element, new(): Element}|{}}
		 * @private
		 */
		this._$Element = (Element.prototype || {});
		/**
		 *
		 * @type {{
		 *   addEventListener: *,
		 *   removeEventListener: *
		 * }}
		 * @private
		 */
		this.__cachedReferences = {
			addEventListener: HTMLElement.prototype.addEventListener,
			removeEventListener: HTMLElement.prototype.removeEventListener
		};
		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._debug = false;

		return this;
	}

	/**
	 *
	 * @param {string} type
	 * @param {function} listener
	 * @param {boolean} useCapture
	 * @private
	 */
	DOMEventTracker.prototype._addEventListener = function addEventListener(type, listener, useCapture) {
		this._debug && console.log('@DOMEventTracker:_addEventListener', arguments);

		if (!this._listeners[type]) {
			this._listeners[type] = [];
		}

		this._listeners[type].push(listener);
	};

	/**
	 *
	 * @param {string} type
	 * @param {function} listener
	 * @param {boolean} useCapture
	 * @private
	 */
	DOMEventTracker.prototype._removeEventListener = function removeEventListener(type, listener, useCapture) {
		this._debug && console.log('@DOMEventTracker:_removeEventListener', arguments);

		if (!this._listeners[type]) {
			return;
		}

		var index = this._listeners[type].indexOf(listener);

		if (index > -1) {
			this._listeners[type].splice(index, 1);
		}
	};

	/**
	 *
	 * @param {string} operation
	 * @returns {Function}
	 * @private
	 */
	DOMEventTracker.prototype._eventHandlerFactory = function _eventHandlerFactory(operation) {
		var self = this;

		if (DOMEventTracker.ALLOWED_EVENT_OPERATIONS.indexOf(operation) < 0) {
			return;
		}

		return function (type, listener, useCapture) {
			self.__cachedReferences[`${operation}EventListener`].apply(this, arguments);
			self[`_${operation}EventListener`].apply(self, arguments);
		};
	};

	/**
	 *
	 * @param {string} type
	 * @returns {null|*}
	 * @private
	 */
	DOMEventTracker.prototype._getEventListeners = function getEventListeners(type) {
		return ((this._listeners[type]) ? this._listeners[type] : this._listeners);
	};

	/**
	 *
	 */
	DOMEventTracker.prototype.initialize = function initialize() {
		this._$Element.addEventListener = this._eventHandlerFactory.call(this, 'add');
		this._$Element.removeEventListener = this._eventHandlerFactory.call(this, 'remove');
		this._$Element.getEventListeners = this._getEventListeners.bind(this);
	};

	/**
	 *
	 * @type {string[]}
	 */
	DOMEventTracker.ALLOWED_EVENT_OPERATIONS = ['add', 'remove'];

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = DOMEventTracker;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return DOMEventTracker;
		});
	} else {
		root.DOMEventTracker = DOMEventTracker;
	}
})(this);