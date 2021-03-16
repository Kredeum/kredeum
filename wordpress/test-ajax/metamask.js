
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var metamask = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                const { on_mount } = this.$$;
                this.$$.on_disconnect = on_mount.map(run).filter(is_function);
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            disconnectedCallback() {
                run_all(this.$$.on_disconnect);
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    /**
     * Returns a Promise that resolves to the value of window.ethereum if it is
     * set within the given timeout, or null.
     * The Promise will not reject, but an error will be thrown if invalid options
     * are provided.
     *
     * @param options - Options bag.
     * @param options.mustBeMetaMask - Whether to only look for MetaMask providers.
     * Default: false
     * @param options.silent - Whether to silence console errors. Does not affect
     * thrown errors. Default: false
     * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
     * be dispatched. Default: 3000
     * @returns A Promise that resolves with the Provider if it is detected within
     * given timeout, otherwise null.
     */
    function detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
        _validateInputs();
        let handled = false;
        return new Promise((resolve) => {
            if (window.ethereum) {
                handleEthereum();
            }
            else {
                window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
                setTimeout(() => {
                    handleEthereum();
                }, timeout);
            }
            function handleEthereum() {
                if (handled) {
                    return;
                }
                handled = true;
                window.removeEventListener('ethereum#initialized', handleEthereum);
                const { ethereum } = window;
                if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
                    resolve(ethereum);
                }
                else {
                    const message = mustBeMetaMask && ethereum
                        ? 'Non-MetaMask window.ethereum detected.'
                        : 'Unable to detect window.ethereum.';
                    !silent && console.error('@metamask/detect-provider:', message);
                    resolve(null);
                }
            }
        });
        function _validateInputs() {
            if (typeof mustBeMetaMask !== 'boolean') {
                throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
            }
            if (typeof silent !== 'boolean') {
                throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
            }
            if (typeof timeout !== 'number') {
                throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
            }
        }
    }
    var dist = detectEthereumProvider;

    /* svelte/metamask.svelte generated by Svelte v3.35.0 */

    const { console: console_1 } = globals;
    const file = "svelte/metamask.svelte";

    // (80:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Connect Metamask";
    			add_location(button, file, 80, 2, 1994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*connectMetamask*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(80:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (78:0) {#if signer}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*signer*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*signer*/ 1) set_data_dev(t, /*signer*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(78:0) {#if signer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*signer*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    			this.c = noop;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("kredeum-metamask", slots, []);
    	let { signer = "" } = $$props;
    	let { addresses = [] } = $$props;
    	let { chainId = "" } = $$props;
    	let { autoconnect = "off" } = $$props;

    	async function handleChainId(_chainId) {
    		console.log("handleChainId <=", _chainId);

    		if (_chainId) {
    			$$invalidate(2, chainId = _chainId);
    		}
    	}

    	async function handleAccounts(_accounts) {
    		if (_accounts.length === 0) {
    			if (autoconnect !== "off") connectMetamask();
    		} else if (_accounts[0] !== signer) {
    			$$invalidate(0, signer = _accounts[0]);

    			if (addresses.indexOf(signer) === -1) {
    				addresses.push(signer);
    				console.log("handleAccounts", _accounts, "=>", signer, addresses);
    			}
    		}
    	}

    	async function connectMetamask() {
    		console.log("connectMetamask");

    		ethereum.request({ method: "eth_requestAccounts" }).then(handleAccounts).catch(e => {
    			if (e.code === 4001) {
    				alert("Please connect to MetaMask.");
    			} else {
    				console.error("ERROR eth_requestAccounts", e);
    			}
    		});
    	}

    	onMount(async function () {
    		console.log("init");
    		const provider = await dist();

    		if (provider) {
    			if (provider !== window.ethereum) {
    				alert("Do you have multiple wallets installed?");
    			}

    			ethereum.request({ method: "eth_accounts" }).then(handleAccounts).catch(e => console.error("ERROR eth_accounts", e));
    			ethereum.request({ method: "eth_chainId" }).then(handleChainId).catch(e => console.error("ERROR eth_chainId", e));
    			ethereum.on("chainChanged", handleChainId);
    			ethereum.on("accountsChanged", handleAccounts);
    		} else {
    			console.log("Please install MetaMask!");
    		}
    	});

    	const writable_props = ["signer", "addresses", "chainId", "autoconnect"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<kredeum-metamask> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("signer" in $$props) $$invalidate(0, signer = $$props.signer);
    		if ("addresses" in $$props) $$invalidate(3, addresses = $$props.addresses);
    		if ("chainId" in $$props) $$invalidate(2, chainId = $$props.chainId);
    		if ("autoconnect" in $$props) $$invalidate(4, autoconnect = $$props.autoconnect);
    	};

    	$$self.$capture_state = () => ({
    		detectEthereumProvider: dist,
    		onMount,
    		signer,
    		addresses,
    		chainId,
    		autoconnect,
    		handleChainId,
    		handleAccounts,
    		connectMetamask
    	});

    	$$self.$inject_state = $$props => {
    		if ("signer" in $$props) $$invalidate(0, signer = $$props.signer);
    		if ("addresses" in $$props) $$invalidate(3, addresses = $$props.addresses);
    		if ("chainId" in $$props) $$invalidate(2, chainId = $$props.chainId);
    		if ("autoconnect" in $$props) $$invalidate(4, autoconnect = $$props.autoconnect);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [signer, connectMetamask, chainId, addresses, autoconnect];
    }

    class Metamask extends SvelteElement {
    	constructor(options) {
    		super();

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance,
    			create_fragment,
    			not_equal,
    			{
    				signer: 0,
    				addresses: 3,
    				chainId: 2,
    				autoconnect: 4
    			}
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["signer", "addresses", "chainId", "autoconnect"];
    	}

    	get signer() {
    		return this.$$.ctx[0];
    	}

    	set signer(signer) {
    		this.$set({ signer });
    		flush();
    	}

    	get addresses() {
    		return this.$$.ctx[3];
    	}

    	set addresses(addresses) {
    		this.$set({ addresses });
    		flush();
    	}

    	get chainId() {
    		return this.$$.ctx[2];
    	}

    	set chainId(chainId) {
    		this.$set({ chainId });
    		flush();
    	}

    	get autoconnect() {
    		return this.$$.ctx[4];
    	}

    	set autoconnect(autoconnect) {
    		this.$set({ autoconnect });
    		flush();
    	}
    }

    customElements.define("kredeum-metamask", Metamask);

    return Metamask;

}());
//# sourceMappingURL=metamask.js.map
