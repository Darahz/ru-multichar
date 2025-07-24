# PowerShell script to move build files into a dated directory

param(
    [string]$BuildName = "",
    [switch]$IncludeTime = $false
)

# Get current directory (should be project root)
$ProjectRoot = Get-Location

# Create date string for folder name
if ($IncludeTime) {
    $DateString = Get-Date -Format "yyyy-MM-dd"
} else {
    $DateString = Get-Date -Format "yyyy-MM-dd"
}

if ($BuildName -ne "") {
    $FolderName = "${DateString}_${BuildName}"
} else {
    $FolderName = "ru-multichar-" + $DateString
}

$BuildsDir = Join-Path $ProjectRoot "builds"
$TargetDir = Join-Path $BuildsDir $FolderName
if (-not (Test-Path $BuildsDir)) {
    Write-Host "Creating builds directory..." -ForegroundColor Green
    New-Item -ItemType Directory -Path $BuildsDir -Force | Out-Null
}

if (Test-Path $TargetDir) {
    Write-Host "Build directory already exists: $TargetDir" -ForegroundColor Yellow
    $Response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($Response -ne "y" -and $Response -ne "Y") {
        Write-Host "Operation cancelled." -ForegroundColor Red
        exit 1
    }
    Remove-Item $TargetDir -Recurse -Force
}

Write-Host "Creating build directory: $TargetDir" -ForegroundColor Green
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null

$ItemsToCopy = @(
    "dist",
    "locales", 
    "static",
    "data",
    "fxmanifest.lua"
)

# Copy each item if it exists
foreach ($Item in $ItemsToCopy) {
    $SourcePath = Join-Path $ProjectRoot $Item
    $DestPath = Join-Path $TargetDir $Item
    
    if (Test-Path $SourcePath) {
        Write-Host "Copying $Item..." -ForegroundColor Cyan
        if (Test-Path $SourcePath -PathType Container) {
            # It's a directory - copy recursively
            Copy-Item $SourcePath -Destination $TargetDir -Recurse -Force
        } else {
            # It's a file
            Copy-Item $SourcePath -Destination $DestPath -Force
        }
    } else {
        Write-Host "Skipping $Item (not found)" -ForegroundColor Yellow
    }
}

# Calculate total size
try {
    $TotalSize = (Get-ChildItem $TargetDir -Recurse | Measure-Object -Property Length -Sum).Sum
    $SizeText = if ($TotalSize -gt 1MB) { 
        "{0:N2} MB" -f ($TotalSize / 1MB) 
    } elseif ($TotalSize -gt 1KB) { 
        "{0:N2} KB" -f ($TotalSize / 1KB) 
    } else { 
        "$TotalSize bytes" 
    }
    Write-Host "Total Size: $SizeText" -ForegroundColor White
} catch {
    Write-Host "Could not calculate total size" -ForegroundColor Yellow
}

Write-Host "`nBuild successfully moved to: $TargetDir" -ForegroundColor Green

# Option to open the builds folder
$Response = Read-Host "`nWould you like to open the builds folder? (y/N)"
if ($Response -eq "y" -or $Response -eq "Y") {
    Invoke-Item $BuildsDir
}
