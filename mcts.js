class MCTS{
    constructor(exploration_weight=1){
        this.Q = new Map();
        this.N = new Map();
        this.children = new Map();
        this.exploration_weight = exploration_weight;
    }

    choose = (node) => {
        if (!this.children.has(node)){
            return node.find_random_child();
        }
        const score = (n) => {
            if(!this.N.has(n) || this.N.get(n)===0){
                return -Infinity;
            }
            let x = this.Q.get(n) / this.N.get(n);
            return x;
        };
        return this.children.get(node).reduce((a,b) => score(a)>score(b) ? a : b);
    };

    do_rollout = (node) => {
        const path = this._select(node);
        const leaf = path[path.length-1];
        this._expand(leaf);
        const reward = this._simulate(leaf);
        this._backpropagate(path, reward);
    };

    _select = (node) => {
        let path = [];
        while(true){
            path.push(node);
            if (!this.children.has(node) || this.children.get(node).length===0){
                //unexplored or terminal node
                return path;
            }
            let unexplored = this.children.get(node).filter(n => !this.children.has(n));
            if(unexplored.length > 0){
                const n = unexplored.pop();
                path.push(n);
                return path;
            }
            node = this._uct_select(node);
        }
    };

    _expand = (node) => {
        if (this.children.has(node)){
            return;
        }
        this.children.set(node, node.find_children());
    };

    _simulate = (node) => {
        let invert_reward = true;
        while (!node.is_terminal()){
            node = node.find_random_child();
            invert_reward = !invert_reward;
        }
        let reward  = node.reward();
        return invert_reward ? 1-reward : reward;
    };

    _backpropagate = (path, reward) => {
        for(const node of [...path].reverse()){
            this.N.has(node) ? this.N.set(node, this.N.get(node)+1) : this.N.set(node, 1);
            this.Q.has(node) ? this.Q.set(node, this.Q.get(node)+reward) : this.Q.set(node, reward);
            reward = 1 - reward;
        }
    };

    _uct_select = (node) => {
        const log_n_vertex = Math.log(this.N.get(node));

        const uct = (n) => this.Q.get(n) / this.N.get(n) + this.exploration_weight * Math.sqrt( log_n_vertex / this.N.get(n));

        return this.children.get(node).reduce((a,b) => uct(a)>uct(b) ? a : b);

    };
}