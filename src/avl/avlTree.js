// ─────────────────────────────────────────────
//  Pure AVL Tree Engine (no React dependency)
// ─────────────────────────────────────────────

/** Create a new AVL node */
function createNode(key) {
    return { key, left: null, right: null, height: 1 };
}

/** Height helper */
function height(node) {
    return node ? node.height : 0;
}

/** Balance factor */
function balanceFactor(node) {
    return node ? height(node.left) - height(node.right) : 0;
}

/** Recalculate height from children */
function updateHeight(node) {
    if (node) {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    }
}

// ── Rotations ────────────────────────────────

function rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    updateHeight(y);
    updateHeight(x);
    return x;
}

function rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    updateHeight(x);
    updateHeight(y);
    return y;
}

// ── Insert ───────────────────────────────────

function insertNode(node, key, steps) {
    if (!node) {
        const newNode = createNode(key);
        steps.push({ type: 'insert', key, snapshot: null }); // snapshot filled after full insert
        return newNode;
    }

    if (key < node.key) {
        node.left = insertNode(node.left, key, steps);
    } else if (key > node.key) {
        node.right = insertNode(node.right, key, steps);
    } else {
        return node; // duplicate — no-op
    }

    updateHeight(node);
    const bf = balanceFactor(node);

    // LL
    if (bf > 1 && key < node.left.key) {
        steps.push({ type: 'rotation', rotation: 'LL', pivot: node.key });
        return rotateRight(node);
    }
    // RR
    if (bf < -1 && key > node.right.key) {
        steps.push({ type: 'rotation', rotation: 'RR', pivot: node.key });
        return rotateLeft(node);
    }
    // LR
    if (bf > 1 && key > node.left.key) {
        steps.push({ type: 'rotation', rotation: 'LR', pivot: node.key });
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }
    // RL
    if (bf < -1 && key < node.right.key) {
        steps.push({ type: 'rotation', rotation: 'RL', pivot: node.key });
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }

    return node;
}

// ── Delete ───────────────────────────────────

function minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
}

function deleteNode(node, key, steps) {
    if (!node) return null;

    if (key < node.key) {
        node.left = deleteNode(node.left, key, steps);
    } else if (key > node.key) {
        node.right = deleteNode(node.right, key, steps);
    } else {
        steps.push({ type: 'delete', key });

        if (!node.left || !node.right) {
            return node.left || node.right;
        }
        const temp = minValueNode(node.right);
        node.key = temp.key;
        node.right = deleteNode(node.right, temp.key, steps);
    }

    updateHeight(node);
    const bf = balanceFactor(node);

    // LL
    if (bf > 1 && balanceFactor(node.left) >= 0) {
        steps.push({ type: 'rotation', rotation: 'LL', pivot: node.key });
        return rotateRight(node);
    }
    // LR
    if (bf > 1 && balanceFactor(node.left) < 0) {
        steps.push({ type: 'rotation', rotation: 'LR', pivot: node.key });
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }
    // RR
    if (bf < -1 && balanceFactor(node.right) <= 0) {
        steps.push({ type: 'rotation', rotation: 'RR', pivot: node.key });
        return rotateLeft(node);
    }
    // RL
    if (bf < -1 && balanceFactor(node.right) > 0) {
        steps.push({ type: 'rotation', rotation: 'RL', pivot: node.key });
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }

    return node;
}

// ── Serialization (deep-copy for snapshots) ──

function cloneTree(node) {
    if (!node) return null;
    return {
        key: node.key,
        height: node.height,
        bf: balanceFactor(node),
        left: cloneTree(node.left),
        right: cloneTree(node.right),
    };
}

// ── Public API ───────────────────────────────

export function createAVL() {
    let root = null;

    return {
        insert(key) {
            const steps = [];
            const snapshots = [];

            // Take snapshot before
            snapshots.push({ label: `Before insert ${key}`, tree: cloneTree(root) });

            root = insertNode(root, key, steps);

            // Take snapshot after each step
            for (const step of steps) {
                snapshots.push({
                    label:
                        step.type === 'rotation'
                            ? `${step.rotation} rotation at node ${step.pivot}`
                            : `Inserted ${step.key}`,
                    tree: cloneTree(root),
                    highlight: step.type === 'rotation' ? step.pivot : step.key,
                    rotationType: step.rotation || null,
                });
            }

            // Final snapshot
            if (snapshots.length === 1) {
                snapshots.push({ label: `Inserted ${key}`, tree: cloneTree(root), highlight: key });
            }

            return { tree: cloneTree(root), snapshots };
        },

        remove(key) {
            const steps = [];
            const snapshots = [];

            snapshots.push({ label: `Before delete ${key}`, tree: cloneTree(root) });

            root = deleteNode(root, key, steps);

            for (const step of steps) {
                snapshots.push({
                    label:
                        step.type === 'rotation'
                            ? `${step.rotation} rotation at node ${step.pivot}`
                            : `Deleted ${step.key}`,
                    tree: cloneTree(root),
                    highlight: step.type === 'rotation' ? step.pivot : null,
                    rotationType: step.rotation || null,
                });
            }

            if (snapshots.length === 1) {
                snapshots.push({ label: `Deleted ${key}`, tree: cloneTree(root) });
            }

            return { tree: cloneTree(root), snapshots };
        },

        getTree() {
            return cloneTree(root);
        },

        clear() {
            root = null;
        },
    };
}
