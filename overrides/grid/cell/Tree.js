Ext.define(null, {
  override: 'Ext.grid.cell.Tree',

  element: {
    reference: 'element',
    children: [{
      reference: 'innerElement',
      cls: Ext.baseCSSPrefix + 'inner-el',
      children: [{
        reference: 'indentElement',
        cls: Ext.baseCSSPrefix + 'indent-el'
      }, {
        reference: 'expanderElement',
        cls: Ext.baseCSSPrefix + 'expander-el ' +
          Ext.baseCSSPrefix + 'font-icon'
      }, {
        reference: 'checkElement',
        listeners: {
          tap: 'onCheckTap'
        },
        cls: Ext.baseCSSPrefix + 'check-el ' +
          Ext.baseCSSPrefix + 'font-icon'
      }, {
        reference: 'iconElement',
        cls: Ext.baseCSSPrefix + 'icon-el ' +
          Ext.baseCSSPrefix + 'font-icon'
      }, {
        reference: 'bodyElement',
        cls: Ext.baseCSSPrefix + 'body-el',
        uiCls: 'body-el'
      }]
    }]
  },

  config: {
    /**
     * @cfg {Boolean} [autoCheckChildren=true]
     * If `true`, checking a folder will check all child nodes. If `false`,
     * checking a folder will not affect child nodes.
     */
    autoCheckChildren: true,

    /**
     * @cfg {Boolean} [checkable=null]
     * If `null`, this cell allows checking if the node's data supports
     * checking by setting it's checkable and checked fields to a boolean.

     * If `true`, this cell allows checking by default with no other
     * configuration. Nodes can still opt out if their checkable field is
     * set to `false`.
     *
     * If `false`, this cell does not support checking regardless of if
     * the node is attempting to support it.
     *
     * See also: {@link #checkableField} and {@link #checkedField}
     */
    checkable: null,

    /**
     * @cfg {String} [checkableField=checkable]
     * The field name in the node that allows to control whether this
     * node can be checked or not.
     */
    checkableField: 'checkable',

    /**
     * @cfg {String} [checkedField=checked]
     * The field name in the node that controls whether this node is
     * checked or not.
     */
    checkedField: 'checked',

    /**
     * @cfg {Boolean} [checkOnTriTap=true]
     * Controls whether that node (and child nodesdepending on
     * {@link #authCheckChildren}) should be checked or unchecked
     * when tapped on and if in tri-mode. So if the node is in
     * tri-mode and you tap on it, `true` will check the item while
     * `false` will uncheck it.
     */
    checkOnTriTap: true,

    /**
     * @cfg {Boolean} [enableTri=true]
     * Whether to support tri-mode. This means when a child is checked
     * or unchecked, the parent nodes will determine if all children
     * are checked or not and if there is a mix of checked and unchecked
     * child nodes, the parent items will show a tri-mode icon.
     */
    enableTri: true
  },

  checkableCls: Ext.baseCSSPrefix + 'treecell-checkable',
  checkedCls: Ext.baseCSSPrefix + 'treecell-checked',
  trimodeCls: Ext.baseCSSPrefix + 'treecell-trimode',
  uncheckedCls: Ext.baseCSSPrefix + 'treecell-unchecked',

  updateCheckable: function () {
    this.syncCheckElement()
  },

  syncCheckElement: function () {
    const me = this
    const record = me.getRecord()
    const cellCheckable = me.getCheckable()
    const checkedCls = me.checkedCls
    const trimodeCls = me.trimodeCls
    const uncheckedCls = me.uncheckedCls

    let checkable = null
    let checked = null

    if (record) {
      checkable = record.get(me.getCheckableField())
      checked = record.get(me.getCheckedField())
    }

    /**
     * If this cell's checkable config is set to true,
     * it wants to force all nodes to be checkable. A
     * node can opt-out of this and set it's checkable
     * to false.
     *
     * If this cell's checkable config is set to false,
     * it will force all nodes to not be checkable and
     * a node cannot opt-in to being checkable. It's
     * always off.
     *
     * If this cell's checkable config is set to null,
     * which is default, this cell will allow the
     * nodes to opt into being checkable by setting
     * their checkable. In this mode, the node's
     * checked has to be set to true/false.
     */
    if (
      (cellCheckable && checkable !== false) || (cellCheckable !== false && checkable && checked != null)
    ) {
      me.addCls(me.checkableCls)

      const shouldTri = me.shouldTri()

      if (checked || shouldTri) {
        if (shouldTri) {
          me.replaceCls(
            [ checkedCls, uncheckedCls ],
            trimodeCls
          )
        } else {
          me.replaceCls(
            [ trimodeCls, uncheckedCls ],
            checkedCls
          )
        }
      } else {
        me.replaceCls(
          [ checkedCls, trimodeCls ],
          uncheckedCls
        )
      }
    } else {
      me.removeCls([
        me.checkableCls,
        checkedCls,
        trimodeCls,
        uncheckedCls
      ])
    }
  },

  shouldTri: function (record, forceCheck) {
    if (this.getEnableTri()) {
      if (!record) {
        record = this.getRecord()
      }

      if (record) {
        const checkedField = this.getCheckedField()
        const checked = record.get(checkedField)

        if (
          // null is auto-mode, if not null
          // then let's look at it's checked field
          checked != null
          &&
          (
            // see if we are asking to force checking
            // the tri check
            !forceCheck
            ||
            // unless we are a leaf, let's just look
            // at the checked field
            record.isLeaf()
          )
        ) {
          return checked && checked !== true
        } else {
          const childNodes = record.childNodes

          if (childNodes && childNodes.length) {
            let found

            return childNodes.some((child, idx) => {
              const checked = child.get(checkedField)

              if (
                // we don't care about the first one
                idx
                &&
                (
                  // Need to check if changed first by casting
                  // into bools so that falsy don't trip each
                  // other (e.g. null should be === false)
                  Boolean(checked) != Boolean(found)
                  ||
                  (
                    checked && checked !== true
                  )
                )
              ) {
                // we found a change, let's return true so that
                // this stops iterating too
                return true
              } else {
                found = checked
              }
            })
          } else {
            return false
          }
        }
      }
    }

    return false
  },

  onCheckTap: function (event) {
    const me = this
    const record = me.getRecord()

    if (record && me.getCheckable() !== false && record.get(me.getCheckableField()) !== false) {
      const checkField = me.getCheckedField()
      const current = record.get(checkField)
      const checked = current && current !== true
        ? this.getCheckOnTriTap()
        : !current

      if (me.fireEvent('beforecheckchange', me, {
          checked,
          current,
          record
        }) !== false) {
        record.set(checkField, checked)

        if (me.getAutoCheckChildren()) {
          record.cascade(child => {
            if (child !== record) {
              child.set(checkField, checked)
            }
          })
        }

        if (me.getEnableTri()) {
          me.bubbleUp(record)
        }

        me.fireEvent('checkchange', me, {
          checked,
          record
        })
      }
    }
  },

  bubbleUp: function (node) {
    const parent = node.parentNode

    if (parent) {
      const shouldTri = this.shouldTri(parent, true)

      parent.set(
        'checked',
        shouldTri
          ? 'tri'
          : node.get('checked')
      )

      this.bubbleUp(parent)
    }
  },

  privates: {
    doNodeUpdate: function (record) {
      this.callParent([record])

      this.syncCheckElement()
    }
  }
})
