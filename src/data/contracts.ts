// ─────────────────────────────────────────────────────────
//  FISCO BCOS 2.x · Solidity ^0.4.25  标准合约模板
// ─────────────────────────────────────────────────────────

export const DSC_TOKEN_SOURCE = `pragma solidity ^0.4.25;

/**
 * @title  DSCToken
 * @notice ERC-20 标准代币合约
 *         适配 FISCO BCOS 2.x（Solidity ^0.4.25）
 * @dev    支持增发 / 销毁 / 暂停，部署者自动成为 owner
 */
contract DSCToken {

    // ── 基础信息 ────────────────────────────
    string  public name     = "DSC Token";
    string  public symbol   = "DSC";
    uint8   public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    bool    public paused;

    mapping(address => uint256)                     private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // ── 事件 ────────────────────────────────
    event Transfer(address indexed from,  address indexed to,      uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint    (address indexed to,    uint256 value);
    event Burn    (address indexed from,  uint256 value);
    event Paused  (address account);
    event Unpaused(address account);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ── 修饰符 ──────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "DSCToken: caller is not the owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "DSCToken: token transfer while paused");
        _;
    }

    // ── 构造函数 ────────────────────────────
    constructor(uint256 initialSupply) public {
        owner = msg.sender;
        _mint(msg.sender, initialSupply * 10 ** uint256(decimals));
    }

    // ── ERC-20 标准接口 ──────────────────────
    function balanceOf(address account)
        public view returns (uint256)
    {
        return _balances[account];
    }

    function transfer(address to, uint256 amount)
        public whenNotPaused returns (bool)
    {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender)
        public view returns (uint256)
    {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount)
        public returns (bool)
    {
        require(spender != address(0), "DSCToken: approve to zero address");
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount)
        public whenNotPaused returns (bool)
    {
        require(
            _allowances[from][msg.sender] >= amount,
            "DSCToken: transfer amount exceeds allowance"
        );
        _allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    // ── 扩展功能 ────────────────────────────
    function mint(address to, uint256 amount)
        public onlyOwner returns (bool)
    {
        _mint(to, amount);
        return true;
    }

    function burn(uint256 amount) public returns (bool) {
        require(
            _balances[msg.sender] >= amount,
            "DSCToken: burn amount exceeds balance"
        );
        _balances[msg.sender] -= amount;
        totalSupply           -= amount;
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "DSCToken: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── 内部函数 ────────────────────────────
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "DSCToken: transfer from zero address");
        require(to   != address(0), "DSCToken: transfer to zero address");
        require(
            _balances[from] >= amount,
            "DSCToken: transfer amount exceeds balance"
        );
        _balances[from] -= amount;
        _balances[to]   += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "DSCToken: mint to zero address");
        totalSupply    += amount;
        _balances[to]  += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
}`;

export const DSC_NFT_SOURCE = `pragma solidity ^0.4.25;

/**
 * @title  DSCNFT
 * @notice ERC-721 非同质化代币合约
 *         适配 FISCO BCOS 2.x（Solidity ^0.4.25）
 * @dev    支持增发 / 销毁 / 全量授权，内置 tokenURI 与持仓查询
 */
contract DSCNFT {

    // ── 基础信息 ────────────────────────────
    string  public name   = "DSC NFT";
    string  public symbol = "DSCNFT";

    uint256 private _totalMinted;
    uint256 private _totalSupply;

    address public owner;

    mapping(uint256 => address)                     private _owners;
    mapping(address => uint256)                     private _balances;
    mapping(uint256 => address)                     private _tokenApprovals;
    mapping(address => mapping(address => bool))    private _operatorApprovals;
    mapping(uint256 => string)                      private _tokenURIs;
    mapping(address => uint256[])                   private _ownedTokens;
    mapping(uint256 => uint256)                     private _ownedTokensIndex;

    // ── 事件 ────────────────────────────────
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool    approved
    );
    event Mint(address indexed to,   uint256 indexed tokenId, string tokenURI);
    event Burn(address indexed from, uint256 indexed tokenId);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ── 修饰符 ──────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "DSCNFT: caller is not the owner");
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(_owners[tokenId] != address(0), "DSCNFT: token does not exist");
        _;
    }

    // ── 构造函数 ────────────────────────────
    constructor() public {
        owner = msg.sender;
    }

    // ── ERC-721 标准接口 ──────────────────────
    function balanceOf(address account)
        public view returns (uint256)
    {
        require(account != address(0), "DSCNFT: balance query for zero address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId)
        public view tokenExists(tokenId) returns (address)
    {
        return _owners[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public view tokenExists(tokenId) returns (string)
    {
        return _tokenURIs[tokenId];
    }

    function approve(address to, uint256 tokenId)
        public tokenExists(tokenId)
    {
        address tokenOwner = _owners[tokenId];
        require(to != tokenOwner, "DSCNFT: approval to current owner");
        require(
            msg.sender == tokenOwner ||
            _operatorApprovals[tokenOwner][msg.sender],
            "DSCNFT: caller is not owner nor approved for all"
        );
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId)
        public view tokenExists(tokenId) returns (address)
    {
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "DSCNFT: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator)
        public view returns (bool)
    {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "DSCNFT: caller is not owner nor approved"
        );
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId)
        public
    {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes   /*data*/
    ) public {
        transferFrom(from, to, tokenId);
    }

    // ── 扩展功能 ────────────────────────────
    function mint(address to, string uri)
        public onlyOwner returns (uint256)
    {
        require(to != address(0), "DSCNFT: mint to zero address");
        _totalMinted += 1;
        _totalSupply += 1;
        uint256 newId = _totalMinted;

        _owners[newId]           = to;
        _balances[to]           += 1;
        _tokenURIs[newId]        = uri;
        _ownedTokensIndex[newId] = _ownedTokens[to].length;
        _ownedTokens[to].push(newId);

        emit Mint(to, newId, uri);
        emit Transfer(address(0), to, newId);
        return newId;
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "DSCNFT: caller is not owner nor approved"
        );
        address tokenOwner = _owners[tokenId];

        _tokenApprovals[tokenId] = address(0);
        _balances[tokenOwner]   -= 1;
        _totalSupply            -= 1;
        delete _owners[tokenId];
        delete _tokenURIs[tokenId];

        uint256 idx     = _ownedTokensIndex[tokenId];
        uint256 lastIdx = _ownedTokens[tokenOwner].length - 1;
        uint256 lastId  = _ownedTokens[tokenOwner][lastIdx];
        _ownedTokens[tokenOwner][idx] = lastId;
        _ownedTokensIndex[lastId]     = idx;
        _ownedTokens[tokenOwner].length -= 1;
        delete _ownedTokensIndex[tokenId];

        emit Burn(tokenOwner, tokenId);
        emit Transfer(tokenOwner, address(0), tokenId);
    }

    function totalSupply() public view returns (uint256) { return _totalSupply; }

    function tokensOfOwner(address account)
        public view returns (uint256[])
    {
        return _ownedTokens[account];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "DSCNFT: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── 内部函数 ────────────────────────────
    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal view returns (bool)
    {
        require(_owners[tokenId] != address(0), "DSCNFT: nonexistent token");
        address tokenOwner = _owners[tokenId];
        return (
            spender == tokenOwner ||
            _tokenApprovals[tokenId] == spender ||
            _operatorApprovals[tokenOwner][spender]
        );
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(_owners[tokenId] == from, "DSCNFT: transfer from incorrect owner");
        require(to != address(0),         "DSCNFT: transfer to zero address");

        _tokenApprovals[tokenId] = address(0);
        _balances[from] -= 1;
        _balances[to]   += 1;
        _owners[tokenId] = to;

        uint256 idx     = _ownedTokensIndex[tokenId];
        uint256 lastIdx = _ownedTokens[from].length - 1;
        uint256 lastId  = _ownedTokens[from][lastIdx];
        _ownedTokens[from][idx]   = lastId;
        _ownedTokensIndex[lastId] = idx;
        _ownedTokens[from].length -= 1;
        delete _ownedTokensIndex[tokenId];

        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);

        emit Transfer(from, to, tokenId);
    }
}`;
